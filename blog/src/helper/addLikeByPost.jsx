import { editarPost, getPostById } from "../api/api";

export const editPostAndReturnResult = async (id, token) => {
  try {
    const postDataArray = await getPostById(id);

    if (postDataArray.length > 0) {
      const postData = postDataArray[0];
      const updatedPostData = {
        id,
        titulo: postData.titulo,
        resumen: postData.resumen,
        autor: postData.autor || 'Autor Desconocido',
        fecha_publicacion: postData.fecha_publicacion,
        user_id: postData?.user_id,
        me_gusta: postData.me_gusta + 1,
      };
      const response = await editarPost(updatedPostData, id, token);

      if (response) {
        return true;
      } else {
        console.error('Error al editar el post');
        return false;
      }
    } else {
      console.error('No se encontraron datos para el post');
      return false;
    }
  } catch (error) {
    console.error('Error al obtener o editar el post:', error);
    return false;
  }
};
