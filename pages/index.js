import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/convert', formData);
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage('Error al procesar el archivo.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Convertir JPG a DXF</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" accept="image/jpeg" onChange={e => setFile(e.target.files[0])} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Convertir</button>
      </form>
      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  );
}