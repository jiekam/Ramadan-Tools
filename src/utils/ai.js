export async function generateRamadhanTodo(prompt) {
  try {
    const API_BASE = import.meta.env.VITE_API_URL || '';
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

