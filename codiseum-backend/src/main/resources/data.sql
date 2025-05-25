INSERT INTO challenges (name, duration, solution, allowed_tags) VALUES
('Encabezado principal con <h1>', 60, '<body><h1>Este es un encabezado principal</h1></body>', 'body,h1'),
('Párrafo simple', 30, '<body><p>Este es un párrafo simple.</p></body>', 'body,p'),
('Lista desordenada', 75, '<body><ul><li>Manzana</li><li>Banana</li><li>Cereza</li></ul></body>', 'body,ul,li'),
('Enlace a Wikipedia con <a>', 45, '<body><a href="https://es.wikipedia.org">Ir a Wikipedia</a></body>', 'body,a'),
('Tabla simple sin borde', 90, '<body><table><tr><td>Celda 1</td><td>Celda 2</td></tr></table></body>', 'body,table,tr,td'),
('Agrupar párrafos con <div>', 60, '<body><div><p>Párrafo uno.</p><p>Párrafo dos.</p></div></body>', 'body,div,p'),
('Encabezado secundario con <h2>', 40, '<body><h2>Subtítulo</h2></body>', 'body,h2'),
('Lista ordenada', 75, '<body><ol><li>Primero</li><li>Segundo</li></ol></body>', 'body,ol,li'),
('Cita con <blockquote>', 50, '<body><blockquote>Esta es una cita famosa.</blockquote></body>', 'body,blockquote'),
('Texto en negrita con <strong>', 35, '<body><p>Este es un texto <strong>importante</strong>.</p></body>', 'body,p,strong');