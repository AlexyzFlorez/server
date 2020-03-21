import Actividad from '../models/actividad.model';
import Departamento from '../models/departamento.model';
import Categoria from '../models/categoria.model';
import Ponente from '../models/ponente.model';
import Poblacion from '../models/poblacion.model';

const uuid = require('uuid/v4');

class OpcionesSeleccionables
{
    async registrarDepartamentos() {

        let departamentos: any = [];
        let nombresDepartamentos = ["Dirección", "Unidad de Informática", "Coordinación de Enlace y Gestión Técnica", "Decanato", "Subdirección Académica",
            "Formación Básica Disciplinaria", "Formación Profesional Generica", "Formación Profesional Específica", "Servicios Académicos", "Evaluación y Seguimiento Académico",
            "Unidad de Tecnología Educativa y Campus Vitual", "Subdirección Administrativa", "Capital Humano", "Recursos Financieros", "Recursos Materiales",
            "Subdirección de Servicios Educativos e Integración Social", "Gestión Escolar", "Servicios Estudiantiles", "Extensión y Servicios Educativos",
            "Unidad Politécnica de Integración Social"];

        for (let i = 0; i < nombresDepartamentos.length; i++) {
            let departamento = {
                nombre: nombresDepartamentos[i]
            };

            departamentos.push(departamento)
        }

        for (let i = 0; i < departamentos.length; i++) {
            let departamento = new Departamento(departamentos[i]);
            await departamento.save();
        }
    }

    async registrarActividades() {

        let actividades: any = [];
        let nombresActividades = ["Ponencia", "Diplomado", "Curso", "Taller", "Exposición", "Jornada", "Firma de Convenio", "Aniversario", "Simulacro"];

        for (let i = 0; i < nombresActividades.length; i++) {
            let actividad = {
                nombre: nombresActividades[i]
            };

            actividades.push(actividad)
        }

        for (let i = 0; i < actividades.length; i++) {
            let actividad = new Actividad(actividades[i]);
            await actividad.save();
        }
    }

    async registrarCategorias() {

        let categorias: any = [];
        let nombresCategorias = ["Actividades académicas", "Actividades a alumnos", "Actividades culturales", "Actividades de acervo histórico",
         "Actividades de difusión y divulgación", "Actividades de emprendimiento", "Actividades de formación, actualización y capacitación",
          "Actividades de género", "Actividades de gestión de la calidad", "Actividades de infraestructura", "Actividades de integración social",
          "Actividades de investigación e innovación", "Actividades de rendición de cuentas", "Actividades de seguridad", "Actividades de sustentabilidad",
           "Actividades de Tecnologías de la información y la Comunicación (TIC'S)", "Actividades de vinculación",
           "Actividades jurídicas y de normatividad institucional", "Actividades laborales y prestaciones institucionales"];

        for (let i = 0; i < nombresCategorias.length; i++) {
            let categoria = {
                nombre: nombresCategorias[i]
            };

            categorias.push(categoria)
        }

        for (let i = 0; i < categorias.length; i++) {
            let categoria = new Categoria(categorias[i]);
            await categoria.save();
        }
    }

    async registrarPonentes() {

        let ponentes: any = [];
        let nombresPonentes = ["Externos", "Internos", "Ambos", "No aplica"];

        for (let i = 0; i < nombresPonentes.length; i++) {
            let ponente = {
                nombre: nombresPonentes[i]
            };

            ponentes.push(ponente)
        }

        for (let i = 0; i < ponentes.length; i++) {
            let ponente = new Ponente(ponentes[i]);
            await ponente.save();
        }
    }

    async registrarPoblacion() {

        let poblaciones: any = [];
        let nombresPoblaciones = ["Externos", "Internos", "Ambos"];

        for (let i = 0; i < nombresPoblaciones.length; i++) {
            let poblacion = {
                nombre: nombresPoblaciones[i]
            };

            poblaciones.push(poblacion)
        }

        for (let i = 0; i < poblaciones.length; i++) {
            let poblacion = new Poblacion(poblaciones[i]);
            await poblacion.save();
        }
    }
}

export const opcionesSeleccionables=new OpcionesSeleccionables();