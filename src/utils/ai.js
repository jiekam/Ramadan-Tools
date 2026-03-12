export async function generateRamadhanTodo(prompt) {
  try {
    let API_BASE = import.meta.env.VITE_API_URL || '';
    if (API_BASE && !API_BASE.startsWith('http')) {
      API_BASE = `https://${API_BASE}`;
    }
    API_BASE = API_BASE.replace(/\/$/, '');

    const res = await fetch(`${API_BASE}/api/ai-todo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Gagal menghasilkan todo list.');
    }

    return Array.isArray(data.todos) ? data.todos : [];
  } catch (error) {
    console.error('Error generating todo:', error);
    throw new Error(
      error?.message ||
        'Gagal menghasilkan todo list. Pastikan server berjalan dan GROQ_API_KEY sudah benar.'
    );
  }
}

