import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dayjs from 'dayjs';
import { stringify } from 'csv-stringify/sync';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaLibSql } from '@prisma/adapter-libsql';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });
const app = express();

app.use(helmet({
  contentSecurityPolicy: false, // Disabled to avoid breaking inline scripts for now
}));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Terlalu banyak permintaan, coba lagi nanti.'
});
app.use(globalLimiter);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Terlalu banyak percobaan login, coba lagi nanti.'
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const sanitized = file.originalname.replace(/\s+/g, '-').toLowerCase();
    cb(null, `${Date.now()}-${sanitized}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Hanya file gambar (JPG/PNG/WEBP) yang diperbolehkan'));
    }
    cb(null, true);
  }
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 8,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    }
  })
);

const wilayahMaster = {
  'Jawa Barat': {
    Bandung: {
      Coblong: ['Dago', 'Lebak Gede'],
      Antapani: ['Antapani Tengah', 'Antapani Kidul']
    }
  },
  'Jawa Tengah': {
    Semarang: {
      Tembalang: ['Bulusan', 'Kramas'],
      Banyumanik: ['Padangsari', 'Ngesrep']
    }
  },
  DIY: {
    Sleman: {
      Depok: ['Caturtunggal', 'Maguwoharjo'],
      Ngaglik: ['Sardonoharjo', 'Minomartani']
    }
  }
};

function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.user || req.session.user.role !== role) {
      return res.status(403).send('Akses ditolak');
    }
    next();
  };
}

function calcStatusSla(tanggalKunjungan, submittedAt = new Date()) {
  const diffDays = dayjs(submittedAt).startOf('day').diff(dayjs(tanggalKunjungan).startOf('day'), 'day');
  return diffDays > 2 ? 'late' : 'on_time';
}

function buildChecklistCode(id) {
  return `CHK-${String(id).padStart(6, '0')}`;
}

async function createAuditEntries({ checklistId, changedById, before, after }) {
  const trackedFields = [
    'tanggalKunjungan',
    'provinsi',
    'kabupaten',
    'kecamatan',
    'desa',
    'segmen',
    'namaMerchant',
    'sudahDiedukasi',
    'bersediaOnboarding',
    'alasanPenolakan',
    'fotoUrl',
    'catatan',
    'statusSla'
  ];

  const changes = trackedFields
    .filter((field) => `${before?.[field] ?? ''}` !== `${after?.[field] ?? ''}`)
    .map((field) => ({
      checklistId,
      changedById,
      fieldName: field,
      oldValue: before?.[field] == null ? null : String(before[field]),
      newValue: after?.[field] == null ? null : String(after[field])
    }));

  if (changes.length > 0) {
    await prisma.auditLog.createMany({ data: changes });
  }
}

app.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  return req.session.user.role === 'BI' ? res.redirect('/bi/dashboard') : res.redirect('/pjp/dashboard');
});

app.get('/register', (_req, res) => res.render('register', { error: null }));
app.post('/register', async (req, res) => {
  try {
    const { email, password, role, nama_lengkap } = req.body;
    if (!email || !password || !role || !nama_lengkap) {
      return res.render('register', { error: 'Semua field wajib diisi.' });
    }

    const hash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email: email.toLowerCase(), password: hash, role, namaLengkap: nama_lengkap }
    });

    res.redirect('/login');
  } catch {
    res.render('register', { error: 'Email sudah terdaftar atau data tidak valid.' });
  }
});

app.get('/login', (_req, res) => res.render('login', { error: null }));
app.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.render('login', { error: 'Email atau password salah.' });
  }

  req.session.user = {
    id: user.id,
    email: user.email,
    role: user.role,
    namaLengkap: user.namaLengkap
  };

  return user.role === 'BI' ? res.redirect('/bi/dashboard') : res.redirect('/pjp/dashboard');
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

app.get('/pjp/dashboard', requireAuth, requireRole('PJP'), async (req, res) => {
  const rows = await prisma.checklist.findMany({
    where: { pjpId: req.session.user.id },
    orderBy: { submittedAt: 'desc' }
  });
  res.render('pjp-dashboard', { user: req.session.user, rows });
});

app.get('/pjp/checklist/new', requireAuth, requireRole('PJP'), (_req, res) => {
  res.render('checklist-form', { user: _req.session.user, checklist: null, error: null, wilayahMaster });
});

app.post('/pjp/checklist', requireAuth, requireRole('PJP'), upload.single('foto'), async (req, res) => {
  try {
    const data = {
      pjpId: req.session.user.id,
      tanggalKunjungan: new Date(req.body.tanggal_kunjungan),
      provinsi: req.body.provinsi,
      kabupaten: req.body.kabupaten,
      kecamatan: req.body.kecamatan,
      desa: req.body.desa,
      segmen: req.body.segmen,
      namaMerchant: req.body.nama_merchant,
      sudahDiedukasi: req.body.sudah_diedukasi === 'Ya',
      bersediaOnboarding: req.body.bersedia_onboarding === 'Ya',
      alasanPenolakan: req.body.bersedia_onboarding === 'Tidak' ? req.body.alasan_penolakan : null,
      fotoUrl: req.file ? `/uploads/${req.file.filename}` : null,
      catatan: req.body.catatan || null,
      statusSla: calcStatusSla(req.body.tanggal_kunjungan)
    };

    const created = await prisma.checklist.create({ data: { ...data, checklistCode: 'PENDING' } });
    const checklistCode = buildChecklistCode(created.id);
    const updated = await prisma.checklist.update({
      where: { id: created.id },
      data: { checklistCode }
    });

    if (updated.statusSla === 'late') {
      console.log(`[NOTIF EMAIL SIMULASI] Checklist ${updated.checklistCode} terlambat oleh ${req.session.user.email}`);
    }

    res.redirect('/pjp/dashboard');
  } catch {
    res.render('checklist-form', {
      user: req.session.user,
      checklist: null,
      error: 'Gagal menyimpan checklist. Pastikan data sudah lengkap.',
      wilayahMaster
    });
  }
});

app.get('/pjp/checklist/:id/edit', requireAuth, requireRole('PJP'), async (req, res) => {
  const checklist = await prisma.checklist.findFirst({
    where: { id: Number(req.params.id), pjpId: req.session.user.id }
  });
  if (!checklist) return res.status(404).send('Checklist tidak ditemukan');
  res.render('checklist-form', { user: req.session.user, checklist, error: null, wilayahMaster });
});

app.post('/pjp/checklist/:id/edit', requireAuth, requireRole('PJP'), upload.single('foto'), async (req, res) => {
  const id = Number(req.params.id);
  const before = await prisma.checklist.findFirst({ where: { id, pjpId: req.session.user.id } });
  if (!before) return res.status(404).send('Checklist tidak ditemukan');

  const payload = {
    tanggalKunjungan: new Date(req.body.tanggal_kunjungan),
    provinsi: req.body.provinsi,
    kabupaten: req.body.kabupaten,
    kecamatan: req.body.kecamatan,
    desa: req.body.desa,
    segmen: req.body.segmen,
    namaMerchant: req.body.nama_merchant,
    sudahDiedukasi: req.body.sudah_diedukasi === 'Ya',
    bersediaOnboarding: req.body.bersedia_onboarding === 'Ya',
    alasanPenolakan: req.body.bersedia_onboarding === 'Tidak' ? req.body.alasan_penolakan : null,
    catatan: req.body.catatan || null,
    statusSla: calcStatusSla(req.body.tanggal_kunjungan, before.submittedAt)
  };

  if (req.file) payload.fotoUrl = `/uploads/${req.file.filename}`;

  const after = await prisma.checklist.update({ where: { id }, data: payload });
  await createAuditEntries({ checklistId: id, changedById: req.session.user.id, before, after });

  if (after.statusSla === 'late') {
    console.log(`[NOTIF EMAIL SIMULASI] Update checklist ${after.checklistCode} terlambat oleh ${req.session.user.email}`);
  }

  res.redirect('/pjp/dashboard');
});

app.get('/bi/dashboard', requireAuth, requireRole('BI'), async (req, res) => {
  const [allRows, allPjp] = await Promise.all([
    prisma.checklist.findMany({ include: { pjp: true }, orderBy: { submittedAt: 'desc' } }),
    prisma.user.findMany({ where: { role: 'PJP' }, orderBy: { namaLengkap: 'asc' } })
  ]);

  const start30 = dayjs().subtract(30, 'day').toDate();
  const totalOnboarding30 = allRows.filter((r) => r.bersediaOnboarding && r.submittedAt >= start30).length;
  const avgSla = allRows.length === 0 ? 0 : Math.round((allRows.filter((r) => r.statusSla === 'on_time').length / allRows.length) * 100);
  const aktifPjp = new Set(allRows.map((r) => r.pjpId)).size;
  const terlambatHariIni = allRows.filter((r) => r.statusSla === 'late' && dayjs(r.submittedAt).isSame(dayjs(), 'day')).length;

  res.render('bi-dashboard', {
    user: req.session.user,
    rows: allRows,
    allPjp,
    metrics: { totalOnboarding30, avgSla, aktifPjp, terlambatHariIni }
  });
});

app.get('/bi/dashboard/data', requireAuth, requireRole('BI'), async (req, res) => {
  const { start, end, segmen, pjpId, provinsi } = req.query;
  const where = {};
  if (start || end) {
    where.submittedAt = {};
    if (start) where.submittedAt.gte = new Date(start);
    if (end) where.submittedAt.lte = dayjs(end).endOf('day').toDate();
  }
  if (segmen) where.segmen = segmen;
  if (pjpId) where.pjpId = Number(pjpId);
  if (provinsi) where.provinsi = provinsi;

  const rows = await prisma.checklist.findMany({ where, include: { pjp: true }, orderBy: { submittedAt: 'desc' } });

  const pjpSummaryMap = new Map();
  rows.forEach((r) => {
    const key = r.pjpId;
    if (!pjpSummaryMap.has(key)) {
      pjpSummaryMap.set(key, { nama: r.pjp.namaLengkap, total: 0, late: 0, onTime: 0 });
    }
    const item = pjpSummaryMap.get(key);
    item.total += 1;
    if (r.statusSla === 'late') item.late += 1;
    else item.onTime += 1;
  });

  const pjpTable = [...pjpSummaryMap.values()].map((x) => ({
    ...x,
    kepatuhan: x.total ? Math.round((x.onTime / x.total) * 100) : 0
  }));

  const weeklyTrend = {};
  rows.filter((r) => r.bersediaOnboarding).forEach((r) => {
    const weekKey = dayjs(r.submittedAt).startOf('week').format('YYYY-MM-DD');
    weeklyTrend[weekKey] = (weeklyTrend[weekKey] || 0) + 1;
  });

  res.json({
    rows,
    pjpTable,
    weeklyTrend,
    mapPoints: rows.map((r) => ({
      id: r.id,
      desa: r.desa,
      kecamatan: r.kecamatan,
      kabupaten: r.kabupaten,
      provinsi: r.provinsi,
      namaMerchant: r.namaMerchant
    }))
  });
});

app.get('/bi/export.csv', requireAuth, requireRole('BI'), async (_req, res) => {
  const rows = await prisma.checklist.findMany({ include: { pjp: true }, orderBy: { submittedAt: 'desc' } });
  const csv = stringify(
    rows.map((r) => ({
      id_checklist: r.checklistCode,
      nama_pjp: r.pjp.namaLengkap,
      tanggal_kunjungan: dayjs(r.tanggalKunjungan).format('YYYY-MM-DD'),
      submitted_at: dayjs(r.submittedAt).format('YYYY-MM-DD HH:mm:ss'),
      segmen: r.segmen,
      merchant: r.namaMerchant,
      lokasi: `${r.desa}, ${r.kecamatan}, ${r.kabupaten}, ${r.provinsi}`,
      sla: r.statusSla
    })),
    { header: true }
  );

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="ayuk-hapan-qris.csv"');
  res.send(csv);
});

app.get('/bi/audit', requireAuth, requireRole('BI'), async (_req, res) => {
  const audits = await prisma.auditLog.findMany({
    include: { checklist: true, changedBy: true },
    orderBy: { changedAt: 'desc' },
    take: 200
  });
  res.render('audit-log', { user: _req.session.user, audits });
});

app.post('/bi/checklist/:id/delete', requireAuth, requireRole('BI'), async (req, res) => {
  const id = Number(req.params.id);
  const before = await prisma.checklist.findUnique({ where: { id } });
  if (!before) return res.redirect('/bi/dashboard');

  await prisma.auditLog.create({
    data: {
      checklistId: id,
      changedById: req.session.user.id,
      fieldName: 'deleted',
      oldValue: before.checklistCode,
      newValue: null
    }
  });

  await prisma.checklist.delete({ where: { id } });
  res.redirect('/bi/dashboard');
});

app.get('/master/wilayah', requireAuth, (_req, res) => {
  res.json(wilayahMaster);
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Ayuk Hapan QRIS jalan di http://localhost:${port}`);
});
