export const loginUser = async (email, password) => {
  try {
    const response = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.access_token;
    } else {
      throw new Error('Credenciales inválidas');
    }
  } catch (error) {
    throw new Error('Error al iniciar sesión');
  }
};
export const registerUser = async (email, password) => {
  try {
    const response = await fetch('http://localhost:8000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      return response;
    } else {
      throw new Error('Error al registar al usuario.');
    }
  } catch (error) {
    throw new Error('Error al registar al usuario.');
  }
};
export const publicaciones = async () => {
  try {
    const response = await fetch('http://localhost:8000/publicacion', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Error al obtener los post');
    }
  } catch (error) {
    throw new Error('Error al obtener los post');
  }
};
export const getPostById = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/publicacion?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Error al obtener el post');
    }
  } catch (error) {
    throw new Error('Error al obtener el post');
  }
};
export const nuevoPost = async (postInfo) => {
  try {
    const response = await fetch('http://localhost:8000/publicacion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postInfo), 
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Error al crear la publicación');
    }
  } catch (error) {
    throw new Error('Error al crear la publicación');
  }
};
export const editarPost = async (postInfo,id,token) => {
  try {
    const response = await fetch(`http://localhost:8000/publicacion/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(postInfo), 
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Error al editar la publicación');
    }
  } catch (error) {
    throw new Error('Error al editar la publicación');
  }
};
export const deletePost = async (id,token) => {
  try {
    const response = await fetch(`http://localhost:8000/publicacion/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return response;
    } else {
      throw new Error('Error al Eliminar la publicación');
    }
  } catch (error) {
    throw new Error('Error al Eliminar la publicación');
  }
};
export const addComentario = async (id,comentario,token) => {
  try {
    const response = await fetch(`http://localhost:8000/publicacion/${id}/comentarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({comentario:comentario}), 
    });
    if (response.ok) {
      return response;
    } else {
      throw new Error('Error al crear el comentario a la publicación');
    }
  } catch (error) {
    throw new Error('Error al crear el comentario a la publicación');
  }
};
