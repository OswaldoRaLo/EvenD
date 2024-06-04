from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import base64

app = Flask(__name__)
CORS(app)

db_config = {
    'user': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'eventos_db',
    'port': 3306
}


def get_db_connection():
    conn = mysql.connector.connect(**db_config)
    return conn

# Usuarios ##############################################################################################
@app.route('/usuarios', methods=['GET'])
def get_usuarios():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM usuarios')
    usuarios = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(usuarios)

@app.route('/usuarios', methods=['POST'])
def create_usuario():
    data = request.json
    apodo = data['apodo']
    correo = data['correo']
    contra = data['contra']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO usuarios (apodo, correo, contra) VALUES (%s, %s, %s)', (apodo, correo, contra))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Usuario creado con éxito'}) 

@app.route('/usuarios/<int:id>', methods=['PUT'])
def update_usuario(id):
    data = request.json
    apodo = data['apodo']
    correo = data['correo']
    contra = data['contra']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE usuarios SET apodo = %s, correo = %s, contra = %s WHERE id = %s', (apodo, correo, contra, id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Usuario actualizado con éxito'})

@app.route('/usuarios/<int:id>', methods=['DELETE'])
def delete_usuario(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM usuarios WHERE id = %s', (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Usuario eliminado con éxito'})

# Eventos ################################################################################################
@app.route('/eventos', methods=['GET'])
def get_eventos():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM eventos')
    eventos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(eventos)

@app.route('/eventos', methods=['POST'])
def create_evento():
    data = request.json
    idusuario = data['idusuario']
    nombreEvento = data['nombreEvento']
    descripcion = data.get('descripcion')
    idtipo = data['idtipo']
    dia = data['dia']
    localizacion = data.get('localizacion')
    foto_base64 = data.get('foto')
    foto = base64.b64decode(foto_base64.split(',')[1]) if foto_base64 else None
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO eventos (idusuario, nombreEvento, descripcion, idtipo, dia, localizacion, foto) VALUES (%s, %s, %s, %s, %s, %s, %s)',
        (idusuario, nombreEvento, descripcion, idtipo, dia, localizacion, foto)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Evento creado con éxito'})

@app.route('/eventos/<int:id>', methods=['PUT'])
def update_evento(id):
    data = request.json
    idusuario = data['idusuario']
    nombreEvento = data['nombreEvento']
    descripcion = data.get('descripcion')
    idtipo = data['idtipo']
    dia = data['dia']
    localizacion = data.get('localizacion')
    foto = data.get('foto')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE eventos SET idusuario = %s, nombreEvento = %s, descripcion = %s, idtipo = %s, dia = %s, localizacion = %s, foto = %s WHERE id = %s', (idusuario, nombreEvento, descripcion, idtipo, dia, localizacion, foto, id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Evento actualizado con éxito'})

@app.route('/eventos/<int:id>', methods=['DELETE'])
def delete_evento(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM eventos WHERE id = %s', (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Evento eliminado con éxito'})


# Lista de amigos ##########################################################################################

@app.route('/listaamigos', methods=['GET'])
def get_listaamigos():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM listaamigos')
    listaamigos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(listaamigos)

@app.route('/listaamigos', methods=['POST'])
def create_listaamigo():
    data = request.json
    idusuario = data['idusuario']
    idamigo = data['idamigo']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO listaamigos (idusuario, idamigo) VALUES (%s, %s)', (idusuario, idamigo))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Amigo añadido con éxito'})

@app.route('/listaamigos/<int:id>', methods=['DELETE'])
def delete_listaamigo(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM listaamigos WHERE id = %s', (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Amigo eliminado con éxito'})

# Tipo de evento #########################################################################################

@app.route('/tipo', methods=['GET'])
def get_tipo():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT id, nombre FROM tipo')
    tipo = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(tipo)

@app.route('/tipo', methods=['POST'])
def create_tipo():
    data = request.json
    nombre = data.get('nombre')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO tipo (nombre) VALUES (%s)', (nombre,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Tipo de evento creado con éxito'})

@app.route('/tipo/<int:id>', methods=['PUT'])
def update_tipo(id):
    data = request.json
    nombre = data.get('nombre')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE tipo SET nombre = %s WHERE id = %s', (nombre, id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Tipo de evento actualizado con éxito'})

@app.route('/tipo/<int:id>', methods=['DELETE'])
def delete_tipo(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM tipo WHERE id = %s', (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Tipo de evento eliminado con éxito'})

# Itinerario del evento ##################################################################################

@app.route('/itinerario', methods=['GET'])
def get_itinerario():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM itinerario')
    itinerario = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(itinerario)

@app.route('/itinerario', methods=['POST'])
def create_itinerario():
    data = request.json
    idevento = data['idevento']
    hora = data['hora']
    concepto = data['concepto']
    peticion = data.get('peticion')
    acepta = data.get('acepta')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO itinerario (idevento, hora, concepto, peticion, acepta) VALUES (%s, %s, %s, %s)', (idevento, hora, concepto, peticion, acepta))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Itinerario creado con éxito'}) 

@app.route('/itinerario/<int:id>', methods=['PUT'])
def update_itinerario(id):
    data = request.json
    idevento = data['idevento']
    hora = data['hora']
    concepto = data['concepto']
    peticion = data.get('peticion')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE itinerario SET idevento = %s, hora = %s, concepto = %s, peticion = %s WHERE id = %s', (idevento, hora, concepto, peticion, id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Itinerario actualizado con éxito'})

@app.route('/itinerario/<int:id>', methods=['DELETE'])
def delete_itinerario(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM itinerario WHERE id = %s', (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Itinerario eliminado con éxito'})

# Invitacion al evento ####################################################################################3

@app.route('/invitacion', methods=['GET'])
def get_invitacion():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM invitacion')
    invitacion = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(invitacion)

@app.route('/invitacion', methods=['POST'])
def create_invitacion():
    data = request.json
    idevento = data['idevento']
    peticion = data['peticion']
    idusuario = data['idusuario']
    limiteacept = data['limiteacept']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO invitacion (idevento, peticion, idusuario, limiteacept) VALUES (%s, %s, %s, %s)', (idevento, peticion, idusuario, limiteacept))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Invitación creada con éxito'})

@app.route('/invitacion/<int:id>', methods=['PUT'])
def update_invitacion(id):
    data = request.json
    idevento = data['idevento']
    peticion = data['peticion']
    idusuario = data['idusuario']
    limiteacept = data['limiteacept']
    acepta = data.get('acepta')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'UPDATE invitacion SET idevento = %s, peticion = %s, idusuario = %s, limiteacept = %s, acepta = %s WHERE id = %s',
        (idevento, peticion, idusuario, limiteacept, acepta, id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Invitación actualizada con éxito'})


@app.route('/invitacion/<int:id>', methods=['DELETE'])
def delete_invitacion(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM invitacion WHERE id = %s', (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Invitación eliminada con éxito'})

# Albúm de fotos del evento ##############################################################################

@app.route('/album', methods=['GET'])
def get_album():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM album')
    album = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(album)

@app.route('/album', methods=['POST'])
def create_album():
    data = request.json
    foto = data['foto']
    descripcion = data.get('descripcion')
    hora = data.get('hora')
    idevento = data['idevento']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO album (foto, descripcion, hora, idevento) VALUES (%s, %s, %s, %s)', (foto, descripcion, hora, idevento))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Álbum creado con éxito'}) 

@app.route('/album/<int:id>', methods=['PUT'])
def update_album(id):
    data = request.json
    foto = data['foto']
    descripcion = data.get('descripcion')
    hora = data['hora']
    idevento = data['idevento']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE album SET foto = %s, descripcion = %s, hora = %s, idevento = %s WHERE id = %s', (foto, descripcion, hora, idevento, id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Álbum actualizado con éxito'})

@app.route('/album/<int:id>', methods=['DELETE'])
def delete_album(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM album WHERE id = %s', (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Álbum eliminado con éxito'})

# Obtiene el ultimo evento ##################################################################################3

@app.route('/eventos/last', methods=['GET'])
def get_last_event():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT id FROM eventos ORDER BY id DESC LIMIT 1')
    last_event = cursor.fetchone()
    cursor.close()
    conn.close()
    return jsonify(last_event)

# Obtiene los datos de una tabla segun su id #############################################################
@app.route('/usuarios/<int:id>', methods=['GET'])
def get_usuarios_by_id(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT apodo FROM usuarios WHERE id = %s', (id,))
    usuario = cursor.fetchone()
    cursor.close()
    conn.close()
    if usuario:
        return jsonify(usuario)
    else:
        return jsonify({'error': 'Usuario no encontrado'}), 404

@app.route('/tipo/<int:id>', methods=['GET'])
def get_tipo_by_id(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT nombre FROM tipo WHERE id = %s', (id,))
    tipo = cursor.fetchone()
    cursor.close()
    conn.close()
    if tipo:
        return jsonify(tipo)
    else:
        return jsonify({'error': 'Tipo no encontrado'}), 404

@app.route('/eventos/<int:id>', methods=['GET'])
def get_eventos_by_id(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM eventos WHERE id = %s', (id,))
    evento = cursor.fetchone()
    cursor.close()
    conn.close()

    if evento:
        if evento['foto']:
            import base64
            evento['foto'] = base64.b64encode(evento['foto']).decode('utf-8')
        return jsonify(evento)
    else:
        return jsonify({'error': 'Evento no encontrado'}), 404
    
@app.route('/listaamigos/<int:idusuario>', methods=['GET'])
def get_listaamigos_by_id(idusuario):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('''
        SELECT usuarios.id, usuarios.apodo
        FROM listaamigos
        JOIN usuarios ON listaamigos.idamigo = usuarios.id
        WHERE listaamigos.idusuario = %s
    ''', (idusuario,))
    amigos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(amigos)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)