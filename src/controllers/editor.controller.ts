import { Request, Response } from 'express';
import { bcriptjsConfig } from '../lib/bcryptjs';
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
import { email } from '../lib/nodemailer';
const config = require('../config/config');
import { fSystem } from '../lib/fileSystem';
import Usuario from '../models/usuario.model';
import Departamento from '../models/departamento.model';
import Actividad from '../models/actividad.model';
import Ponente from '../models/ponente.model';
import Poblacion from '../models/poblacion.model';
import Categoria from '../models/categoria.model';
import Evento from '../models/evento.model';
import Evidencia from '../models/evidencia.model';

class EditorController {

  public async existeUsuario(req: Request, res: Response) {
    let errores = [];
    try {
      const idUsuario = req.params.id

      const usuario = await Usuario.find({ _id: idUsuario });

      if (usuario.length > 0) {
        errores.push("Ninguno")
      }
      else {
        errores.push("No existe")
      }

      let respuesta: any = { errores }
      res.json(respuesta);
    }
    catch (e) {
      console.log("Error metodo existe usuario");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  //Login
  public async iniciarSesion(req: any, res: Response) {
    let errores = [];
    try {
      let correo = req.body.correo;
      let password = req.body.password;

      let usuario: any = await Usuario.find({ correo: correo });

      let estadoUsuario;

      //Si el correo existe
      if (usuario.length > 0) {
        estadoUsuario = usuario[0].estado_registro;
        //Si existe el correo y esta registrado
        if (estadoUsuario == 'Registrado') {
          const idUsuario = usuario[0]._id;

          const passwordBase = usuario[0].password; //Contraseña de la base de datos

          if (!bcriptjsConfig.comparar(password, passwordBase)) {
            errores.push("Password incorrecta");
            let respuesta: any = { errores }
            res.json(respuesta);
          }
          else {
            let usuario2: any = await Usuario.find({ correo: correo });
            const tipoUsuario = usuario2[0].tipo_usuario;

            //Crear info para TOKEN
            const usuario = {
              _id: idUsuario,
              correo: correo,
              tipo_usuario: tipoUsuario
            }

            var token = jwt.sign({ usuario: usuario }, config.SEED, { expiresIn: 14400 }); //usuario, clave, 4 horas de expiracion

            errores.push("Ninguno");

            res.json({ errores: errores, token: token, usuarioToken: usuario });
          }
        }
        else {
          errores.push("Usuario no registrado");
          let respuesta: any = { errores }
          res.json(respuesta);
        }
      }
      else {
        errores.push("Usuario no registrado");
        let respuesta: any = { errores }
        res.json(respuesta);
      }

    } catch (e) {
      console.log("Error metodo iniciar sesion");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  public async validarCodigoPassword(req: Request, res: Response) {
    let errores = [];
    try {
      let codigo = req.params.codigo;
      let usuario: any = await Usuario.find({ codigo_res_password: codigo });

      if (usuario.length > 0) {
        errores.push("Ninguno")
      }
      else {
        errores.push("Codigo incorrecto")
      }
      let respuesta: any = { errores }
      res.json(respuesta);
    }
    catch (e) {
      console.log("Error metodo validar codigo");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  public async recuperarPassword(req: Request, res: Response) {
    let errores = [];
    try {
      let correo = req.body.correo;
      let errores = [];

      let banderaCorreo = false;

      let usuario: any = await Usuario.find({ correo: correo });

      if (usuario.length > 0) {
        banderaCorreo = false;
      }
      else {
        banderaCorreo = true;
        errores.push("Correo no registrado");
      }

      if (!banderaCorreo) {
        let usuario: any = await Usuario.find({ correo: correo });
        const codigo = usuario[0].codigo_res_password;

        email.enviarCorreo(correo, 'Restablecimiento de contraseña', `
        <div style='width:30vw; padding:50px; display:block; border:1px solid #16B4FC; text-align:center; margin:0 auto'>
          <p style='width:100%; color:#53575A'>Haz solicitado el restablecimiento de tu contraseña en SisEvent</p>
          <a href='${config.URI_CLIENT}/restablecer-password/${codigo}' style='text-decoration:none; background:#16B4FC; color:#fff; border-radius:20px;padding:10px; font-size:14px; width:100%; display:block; text-align:center; margin:0 auto'>Restablecer contraseña</a>
        </div>`
        );
        errores.push("Ninguno");
      }
      else {
        console.log("Correo no registrado");
      }
      let respuesta: any = { errores }
      res.json(respuesta);

    } catch (e) {
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  public async restablecerPassword(req: Request, res: Response) {
    let errores: any = [];
    try {

      let password = req.body.password;
      let codigo = req.body.codigo_res_password;

      let usuario: any = await Usuario.find({ codigo_res_password: codigo });

      if (usuario.length < 1) {
        errores.push("Codigo incorrecto")
      }
      else {
        let nuevaPassword = bcriptjsConfig.encriptar(password);
        let nuevoCodigo = uuid();

        await Usuario.findByIdAndUpdate(usuario[0]._id, { password: nuevaPassword, codigo_res_password: nuevoCodigo });

        errores.push("Ninguno")
      }

      let respuesta: any = { errores }
      res.json(respuesta);
    }
    catch (e) {
      console.log("Error metodo restablecer codigo");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  //Registro
  public async preregistrarUsuario(req: Request, res: Response) {
    let errores = [];
    try {
      let nuevoUsuario: any = {
        nombre: req.body.nombre,
        apellido_paterno: req.body.apellido_paterno,
        apellido_materno: req.body.apellido_materno,
        telefono: req.body.telefono,
        num_empleado: req.body.num_empleado,
        correo: req.body.correo,
        password: bcriptjsConfig.encriptar(req.body.password),
        estado_registro: req.body.estado_registro,
        tipo_usuario: config.TIPO_EDITOR,
        codigo_res_password: uuid()
      }


      //VALIDAMOS LOS CAMPOS QUE DEBEN Y NO DEBEN ESTAR REGISTRADOS
      const usuario = await Usuario.find({ correo: nuevoUsuario.correo });

      if (usuario.length > 0) {
        errores.push("Usuario registrado");
      }

      const numEmpleados = await Usuario.find({ num_empleado: nuevoUsuario.num_empleado });

      if (numEmpleados.length > 0) {
        errores.push("Num empleado registrado");
      }

      //SI HUBO ERRORES DE CAMPOS REGITRADOS
      if (errores.length > 0) {
        let respuesta: any = { errores }
        console.log("Hay campos invalidos en el servidor")
        res.json(respuesta)
      }
      else {
        //INSERTAMOS DATOS---------------------------------------------
        console.log("No hay errores en la respuesta")

        const departamento: any = await Departamento.find({ nombre: req.body.departamento.nombre });
        nuevoUsuario.departamento = departamento[0];

        let usuario = new Usuario(nuevoUsuario);
        //Guardar en la base de datos
        await usuario.save();

        const correosAdministrador: any = await Usuario.find({ tipo_usuario: config.TIPO_ADMINISTRADOR });
        const correoAdministrador = correosAdministrador[0].correo;

        email.enviarCorreo(correoAdministrador, 'Solicitud de registro', `<p>Hay una nueva solicitud de registro al sistema SisEvent</p>`);
        //ENVIAMOS RESPUESTA
        let errores = [];
        errores.push("Ninguno");
        let respuesta: any = { errores }
        res.json(respuesta);

      }
    }
    catch (e) {
      console.log("Error metodo preregistrar usuario");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  //Calendario-Modal registrar evento
  public async obtenerDepartamentos(req: Request, res: Response) {
    let errores = [];
    try {
      let departamentos: any = await Departamento.find({}).sort({ nombre: 1 });
      res.json(departamentos);
    }
    catch (e) {
      console.log("Error metodo obtener departamentos");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  public async obtenerActividades(req: Request, res: Response) {
    let errores = [];
    try {
      let actividades: any = await Actividad.find({}).sort({ nombre: 1 });
      res.json(actividades);
    }
    catch (e) {
      console.log("Error metodo obtener actividades");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  public async obtenerCategorias(req: Request, res: Response) {
    let errores = [];
    try {
      let categorias: any = await Categoria.find({}).sort({ nombre: 1 });
      res.json(categorias);
    }
    catch (e) {
      console.log("Error metodo obtener categorias");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  public async obtenerPonentes(req: Request, res: Response) {
    let errores = [];
    try {

      let ponentes: any = await Ponente.find({}).sort({ nombre: 1 });

      res.json(ponentes);
    }
    catch (e) {
      console.log("Error metodo obtener ponentes");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  public async obtenerPoblacion(req: Request, res: Response) {
    let errores = [];
    try {
      let poblacion: any = await Poblacion.find({}).sort({ nombre: 1 });
      res.json(poblacion);
    }
    catch (e) {
      console.log("Error metodo obtener poblacion");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  public async registrarEvento(req: any, res: Response) {
    let errores = [];
    try {
      let usuarios: any = await Usuario.find({ _id: req.body.usuario });

      let usuario = usuarios[0];
      let nombre = req.body.nombre;
      let departamento = req.body.departamento;
      let costo = req.body.costo;
      let tipo_actividad = req.body.tipo_actividad;
      let nombre_actividad = req.body.actividad;
      let categoria = req.body.categoria;
      let fecha_inicio = req.body.fecha_inicio;
      let fecha_termino = req.body.fecha_termino;
      let hora_inicio = req.body.hora_inicio;
      let hora_termino = req.body.hora_termino;
      let descripcion = req.body.descripcion;
      let ponentes = req.body.ponentes;
      let poblacion = req.body.poblacion;
      let solicitud_memoria = req.body.solicitud_memoria;
      let url_portada = req.file.filename;

      if (tipo_actividad === "Otra") {

        let actividades: any = await Actividad.find({});
        for (let i = 0; i < actividades.length; i++) {
          if ((actividades[i].nombre).toUpperCase() === nombre_actividad.toUpperCase()) {
            errores.push("Actividad existente")
          }
        }
      }

      if (errores.length > 0) {
        let respuesta: any = { errores }
        console.log("Hay campos invalidos en el servidor")
        fSystem.eliminarArchivo(req.file.filename);
        res.json(respuesta)
      }
      else {
        if (tipo_actividad === "Otra") {
          //Creamos el objeto con el schema que declaramos
          let infoActividad = {
            nombre: nombre_actividad
          }
          let actividad = new Actividad(infoActividad);
          //Guardar en la base de datos
          await actividad.save();

        }
        else {
          nombre_actividad = tipo_actividad;
        }

        let departamentos: any = await Departamento.find({ nombre: departamento });

        let categorias: any = await Categoria.find({ nombre: categoria });

        let actividades: any = await Actividad.find({ nombre: nombre_actividad });

        let ponente: any = await Ponente.find({ nombre: ponentes });

        let poblacion2: any = await Poblacion.find({ nombre: poblacion });

        let infoEvento = {
          nombre: nombre,
          costo: costo,
          descripcion: descripcion,
          url_portada: url_portada,
          en_memoria: undefined,
          usuario: usuario,
          fecha_inicio: fecha_inicio,
          fecha_termino: fecha_termino,
          hora_inicio: hora_inicio,
          hora_termino: hora_termino,
          departamento: departamentos[0],
          tipo_actividad: actividades[0],
          categoria: categorias[0],
          ponentes: ponente[0],
          poblacion: poblacion2[0],
          solicitud_memoria: solicitud_memoria,
          evidencias: [],
          mujeres: "-",
          hombres: "-"
        }

        let evento = new Evento(infoEvento);
        //Guardar en la base de datos
        await evento.save();

        errores.push(evento._id)
        errores.push("Ninguno")
        let respuesta: any = { errores }
        res.json(respuesta);
      }
    }
    catch (e) {
      console.log("Error metodo registrar evento");
      fSystem.eliminarArchivo(req.file.filename);
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  //Perfil
  public async obtenerPerfil(req: Request, res: Response) {
    let errores = [];
    try {
      const idUsuario = req.params.id
      const usuario: any = await Usuario.find({ _id: idUsuario }).populate('departamento');
      res.json(usuario);
    }
    catch (e) {
      console.log("Error metodo obtener perfil");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  public async actualizarPerfil(req: Request, res: Response) {
    let errores = [];
    try {
      const idUsuario = req.params.id

      let reqUsuario: any = {
        nombre: req.body.nombre,
        apellido_paterno: req.body.apellido_paterno,
        apellido_materno: req.body.apellido_materno,
        telefono: req.body.telefono,
        num_empleado: req.body.num_empleado,
        correo: req.body.correo,
        password: bcriptjsConfig.encriptar(req.body.password),
        estado_registro: req.body.estado_registro,
        departamento: req.body.departamento
      }

      const departamento: any = await Departamento.find({ nombre: reqUsuario.departamento.nombre, });
      reqUsuario.departamento = departamento[0];

      //VALIDAMOS LOS CAMPOS QUE DEBEN Y NO DEBEN ESTAR REGISTRADOS
      const correoRegistrados: any = await Usuario.find({ correo: reqUsuario.correo });

      if (correoRegistrados.length > 0 && correoRegistrados[0]._id != idUsuario) {
        errores.push("Usuario registrado");
      }

      const numEmpleados: any = await Usuario.find({ num_empleado: reqUsuario.num_empleado });

      if (numEmpleados.length > 0 && numEmpleados[0]._id != idUsuario) {
        errores.push("Num empleado registrado");
      }

      //SI HUBO ERRORES DE CAMPOS REGITRADOS
      if (errores.length > 0) {
        console.log("Hay campos invalidos en el servidor")
      }
      else {
        //INSERTAMOS DATOS---------------------------------------------
        console.log("No hay errores en la respuesta")

        let usuario: any = await Usuario.find({ _id: idUsuario });

        await Usuario.findByIdAndUpdate(usuario[0]._id, { nombre: reqUsuario.nombre, apellido_paterno: reqUsuario.apellido_paterno, apellido_materno: reqUsuario.apellido_materno, telefono: reqUsuario.telefono, num_empleado: reqUsuario.num_empleado, departamento: reqUsuario.departamento, correo: reqUsuario.correo, password: reqUsuario.password });

        errores.push("Ninguno");
      }

      let respuesta: any = { errores }
      res.json(respuesta);

    } catch (e) {
      console.log("Error metodo actualizar alumno");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  //Mis eventos
  public async obtenerMisEventos(req: Request, res: Response) {
    let errores = [];
    try {

      let idUsuario = req.params.idUsuario;
      const usuario: any = await Usuario.find({ _id: idUsuario }).populate('departamento');
      const eventos: any = await Evento.find({ usuario: usuario[0] }).populate(['departamento', 'tipo_actividad', 'categoria', 'ponentes', 'poblacion', 'usuario']).sort({ fecha_inicio: 1 });

      res.json(eventos);
    }
    catch (e) {
      console.log("Error metodo obtener mis eventos");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  public async eliminarEvento(req: Request, res: Response) {
    let errores = [];
    try {

      const idEvento = req.params.id;
      const eventos: any = await Evento.find({ _id: idEvento });
      await Evento.findByIdAndDelete(idEvento);

      fSystem.eliminarArchivo(eventos[0].url_portada);
      errores.push("Ninguno")
      let respuesta: any = { errores }
      res.json(respuesta);

    }
    catch (e) {
      console.log("Error metodo eliminar evento");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  public async eliminarEvidencia(req: Request, res: Response) {
    let errores = [];
    try {

      const idEvidencia = req.params.id;
      const evidencias: any = await Evidencia.find({ _id: idEvidencia });
      await Evidencia.findByIdAndDelete(idEvidencia);

      fSystem.eliminarArchivo(evidencias[0].url_evidencia);
      errores.push("Ninguno")
      let respuesta: any = { errores }
      res.json(respuesta);

    }
    catch (e) {
      console.log("Error metodo eliminar evidencia");
      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

  public async editarEvento(req: any, res: Response) {
    let errores = [];
    try {
      let idEvento=req.params.id;

      let nombre = req.body.nombre;
      let departamento = req.body.departamento;
      let costo = req.body.costo;
      let tipo_actividad = req.body.tipo_actividad;
      let nombre_actividad = req.body.actividad;
      let categoria = req.body.categoria;
      let fecha_inicio = req.body.fecha_inicio;
      let fecha_termino = req.body.fecha_termino;
      let hora_inicio = req.body.hora_inicio;
      let hora_termino = req.body.hora_termino;
      let descripcion = req.body.descripcion;
      let ponentes = req.body.ponentes;
      let poblacion = req.body.poblacion;
      let solicitud_memoria = req.body.solicitud_memoria;
      let hombres = req.body.hombres;
      let mujeres = req.body.mujeres;
      let url_portada;
      
      if (req.file == undefined) {
      }
      else {
        url_portada = req.file.filename;
      }

      if (tipo_actividad === "Otra") {

        let actividades: any = await Actividad.find({});
        for (let i = 0; i < actividades.length; i++) {
          if ((actividades[i].nombre).toUpperCase() === nombre_actividad.toUpperCase()) {
            errores.push("Actividad existente")
          }
        }
      }

      if (errores.length > 0) {
        let respuesta: any = { errores }
        console.log("Hay campos invalidos en el servidor")
        if (req.file == undefined) {
        }
        else {
          fSystem.eliminarArchivo(req.file.filename);
        }
        res.json(respuesta)
      }
      else {
        if (tipo_actividad === "Otra") {
          //Creamos el objeto con el schema que declaramos
          let infoActividad = {
            nombre: nombre_actividad
          }
          let actividad = new Actividad(infoActividad);
          //Guardar en la base de datos
          await actividad.save();

        }
        else {
          nombre_actividad = tipo_actividad;
        }

        let departamentos: any = await Departamento.find({ nombre: departamento });

        let categorias: any = await Categoria.find({ nombre: categoria });

        let actividades: any = await Actividad.find({ nombre: nombre_actividad });

        let ponente: any = await Ponente.find({ nombre: ponentes });

        let poblacion2: any = await Poblacion.find({ nombre: poblacion });

        let infoEvento;

        if (req.file == undefined) {
          infoEvento = {
            nombre: nombre,
            costo: costo,
            descripcion: descripcion,
            fecha_inicio: fecha_inicio,
            fecha_termino: fecha_termino,
            hora_inicio: hora_inicio,
            hora_termino: hora_termino,
            departamento: departamentos[0],
            tipo_actividad: actividades[0],
            categoria: categorias[0],
            ponentes: ponente[0],
            poblacion: poblacion2[0],
            solicitud_memoria: solicitud_memoria,
            mujeres: mujeres,
            hombres: hombres
          }
        }
        else {
          infoEvento = {
            nombre: nombre,
            costo: costo,
            descripcion: descripcion,
            url_portada: url_portada,
            fecha_inicio: fecha_inicio,
            fecha_termino: fecha_termino,
            hora_inicio: hora_inicio,
            hora_termino: hora_termino,
            departamento: departamentos[0],
            tipo_actividad: actividades[0],
            categoria: categorias[0],
            ponentes: ponente[0],
            poblacion: poblacion2[0],
            solicitud_memoria: solicitud_memoria,
            mujeres: mujeres,
            hombres: hombres
          }
        }

        let evento:any=await Evento.find({_id:idEvento})

        await Evento.findByIdAndUpdate(idEvento, infoEvento);

        if (req.file == undefined) {
          
        }
        else {
          fSystem.eliminarArchivo(evento[0].url_portada); 
        }

        
        errores.push("Ninguno")
        let respuesta: any = { errores }
        res.json(respuesta);
      }
    }
    catch (e) {
      console.log("Error metodo registrar evento");
      if (req.file == undefined) {
      }
      else {
        fSystem.eliminarArchivo(req.file.filename);
      }

      errores.push("Consultas")
      let respuesta: any = { errores }
      res.json(respuesta);
    }
  }

}

export const editorController = new EditorController();

