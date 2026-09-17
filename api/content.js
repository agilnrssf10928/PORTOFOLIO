const { isAuthenticated } = require('./_auth');

const defaults = {
  name: 'Agil Nurussofa',
  photoUrl: 'foto.jpg',
  heroDesc: {
    id: 'Siswa SMK Jurusan Perhotelan yang juga suka ngoding. Lagi belajar bikin website sambil mendalami dunia hospitality. Suka tantangan baru dan ngopi tentunya.',
    en: 'A Hospitality Vocational School student who also loves coding. Learning to build websites while exploring the world of hospitality. Love new challenges and coffee, of course.'
  },
  about: {
    id: 'Halo Saya adalah siswa SMK Pariwisata Cikarang Selatan jurusan Perhotelan yang punya ketertarikan besar di dunia teknologi, khususnya web development. Sambil belajar ilmu hospitality — mulai dari front office, housekeeping, sampai food & beverage — saya juga ngulik coding buat bikin website. Buat saya, dua dunia ini bisa jalan bareng: pelayanan yang baik dan teknologi yang tepat bakal bikin pengalaman tamu makin berkesan.',
    en: "Hi, I'm a Hospitality major student at SMK Pariwisata Cikarang Selatan with a big interest in technology, especially web development. While learning hospitality — from front office, housekeeping, to food & beverage — I also dive into coding to build websites. For me, these two worlds can go together: great service and the right technology make guest experiences more memorable."
  }
};

async function kvRequest(method, path, body) {
  const response = await fetch(`${process.env.KV_REST_API_URL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  if (!response.ok) throw new Error('KV request failed');
  return response.json();
}

module.exports = async function handler(request, response) {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return response.status(500).json({ error: 'KV belum dikonfigurasi di Vercel.' });
  }

  try {
    if (request.method === 'GET') {
      const result = await kvRequest('GET', '/get/portfolio_content');
      return response.status(200).json(result.result || defaults);
    }
    if (request.method === 'PUT') {
      if (!isAuthenticated(request)) return response.status(401).json({ error: 'Silakan login.' });
      const incoming = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
      const content = {
        name: String(incoming.name || defaults.name).slice(0, 100),
        photoUrl: String(incoming.photoUrl || defaults.photoUrl).slice(0, 500),
        heroDesc: { id: String(incoming.heroDesc?.id || '').slice(0, 1000), en: String(incoming.heroDesc?.en || '').slice(0, 1000) },
        about: { id: String(incoming.about?.id || '').slice(0, 3000), en: String(incoming.about?.en || '').slice(0, 3000) }
      };
      await kvRequest('POST', '/set/portfolio_content', content);
      return response.status(200).json(content);
    }
    return response.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return response.status(500).json({ error: 'Gagal mengakses penyimpanan.' });
  }
};
