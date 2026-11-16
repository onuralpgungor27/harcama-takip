import { useState, useEffect } from 'react';

const KATEGORI_RENKLERI = {
  Gıda: 'bg-success',
  Ulaşım: 'bg-primary',
  Eğitim: 'bg-info text-dark',
  Eğlence: 'bg-warning text-dark',
  Diğer: 'bg-secondary',
};

export default function App() {
  const [harcamalar, setHarcamalar] = useState(() => {
    const kayitli = localStorage.getItem('harcamalar_v1');
    return kayitli ? JSON.parse(kayitli) : [];
  });

  const [baslik, setBaslik] = useState('');
  const [tutar, setTutar] = useState('');
  const [kategori, setKategori] = useState('Gıda');

  useEffect(() => {
    localStorage.setItem('harcamalar_v1', JSON.stringify(harcamalar));
  }, [harcamalar]);

  const harcamaEkle = (e) => {
    e.preventDefault();
    if (!baslik.trim() || !tutar || Number(tutar) <= 0) return;

    const yeniKayit = {
      id: Date.now(),
      baslik: baslik.trim(),
      tutar: parseFloat(tutar),
      kategori,
      tarih: new Date().toLocaleDateString('tr-TR'),
    };

    setHarcamalar([yeniKayit, ...harcamalar]);
    setBaslik('');
    setTutar('');
  };

  const harcamaSil = (id) => {
    setHarcamalar(harcamalar.filter((item) => item.id !== id));
  };

  const toplamTutar = harcamalar.reduce((acc, item) => acc + item.tutar, 0);

  return (
    <div className="container py-5" style={{ maxWidth: '850px' }}>
      <h2 className="fw-bold text-center mb-4">Kişisel Harcama Takip Paneli</h2>

      {/* Özet Kartları */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm bg-dark text-white">
            <div className="card-body">
              <small className="text-uppercase text-white-50">Toplam Harcama</small>
              <h3 className="fw-bold mt-1 mb-0">
                {toplamTutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <small className="text-uppercase text-muted">Toplam İşlem Sayısı</small>
              <h3 className="fw-bold mt-1 mb-0">{harcamalar.length} Adet</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Harcama Ekleme Formu */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Yeni Harcama Ekle</h5>
          <form onSubmit={harcamaEkle} className="row g-2">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Açıklama (ör. Öğle Yemeği)"
                value={baslik}
                onChange={(e) => setBaslik(e.target.value)}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="Tutar (₺)"
                value={tutar}
                onChange={(e) => setTutar(e.target.value)}
                required
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
              >
                {Object.keys(KATEGORI_RENKLERI).map((kat) => (
                  <option key={kat} value={kat}>
                    {kat}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2 d-grid">
              <button type="submit" className="btn btn-primary fw-semibold">
                Ekle
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Harcama Tablosu */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">Açıklama</th>
                  <th>Kategori</th>
                  <th>Tarih</th>
                  <th className="text-end">Tutar</th>
                  <th className="text-center">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {harcamalar.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      Henüz harcama eklenmedi. Yukarıdaki formdan ilk kaydını oluşturabilirsin.
                    </td>
                  </tr>
                ) : (
                  harcamalar.map((item) => (
                    <tr key={item.id}>
                      <td className="ps-3 fw-medium">{item.baslik}</td>
                      <td>
                        <span className={`badge ${KATEGORI_RENKLERI[item.kategori]}`}>
                          {item.kategori}
                        </span>
                      </td>
                      <td className="text-muted small">{item.tarih}</td>
                      <td className="text-end fw-bold">
                        {item.tutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => harcamaSil(item.id)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}