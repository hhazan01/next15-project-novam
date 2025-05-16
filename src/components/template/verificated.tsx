export const verificated = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verificación de Correo</title>
    <style>
      body {
        background-color: #f7f7f7;
        font-family: "Roboto", sans-serif;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 800px;
        margin: 30px auto;
        padding: 40px; /* Aumentado el padding para más espacio */
        background-color: #ffffff;
        border: 1px solid #ddd;
        text-align: left; /* Alinea el texto a la izquierda */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        border-radius: 5px;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        margin: 20px 0;
        background-color: #26c6da; /* Color del botón */
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .footer {
        font-size: 12px;
        color: #777777;
        margin-top: 20px;
      }
      .header {
        font-weight: bold; /* Hace el título en negritas */
      }
    </style>
  </head>
  <body>
    <div class="container">
      <img
        src="https://github.com/shadcn.png"
        alt="Logo"
        style="height: 100px; margin: 0 auto 20px; display: block; border-radius: 4px"
      />
      <h1 class="header">%TITLE%</h1>
      <p>Hola, %FROM%:</p>
      %MESSAGE%
      <a href="%URL%" class="button">%BUTTON%</a>
      <p class="footer">
        Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en
        contacto con nuestro equipo de soporte.
      </p>
      <p class="footer">Atentamente,</p>
      <p class="footer">GURTI</p>
    </div>
  </body>
</html>`;
