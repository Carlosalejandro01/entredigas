import type { Actividad, Poi, Restaurant } from "@/components/guia/GuideBits";

export const bloque1: Poi[] = [
  {
    n: 1,
    name: "Santillana del Mar",
    distance: "Al salir por la puerta",
    highlight: true,
    description:
      "Estás dentro de la villa medieval mejor conservada del norte: Colegiata románica, calles empedradas y la Casa del Águila. A primera hora y al anochecer el pueblo se queda vacío y es cuando mejor está.",
    meta: [
      { label: "Entrada", value: "libre · Colegiata 3 €" },
      { label: "Horario", value: "pueblo abierto siempre" },
      { label: "Reserva", value: "no" },
      { label: "Aparcar", value: "ya estás dentro: deja el coche y anda" },
    ],
  },
  {
    n: 2,
    name: "Museo y Neocueva de Altamira",
    distance: "1,5 km · 4 min",
    highlight: true,
    description:
      "La cueva original está cerrada al público; la Neocueva es una réplica exacta del techo de los bisontes, y el museo que la rodea es excelente. Patrimonio de la Humanidad, y lo tienes a veinte minutos andando. Reserva en línea al menos un día antes: los cupos vuelan en verano.",
    meta: [
      { label: "Entrada", value: "3 € · reducida 1,50 € · menores de 18 gratis" },
      { label: "Gratis", value: "sábados desde las 14:00 y domingos" },
      {
        label: "Horario",
        value:
          "mayo–oct. 9:30–20:00 · nov.–abr. 9:30–18:00 · dom. y festivos hasta 15:00 · lunes cerrado",
      },
      { label: "Reserva", value: "sí, muy recomendable" },
      { label: "Duración", value: "1 h 30" },
    ],
  },
  {
    n: 3,
    name: "Playa de Santa Justa y su ermita",
    distance: "6 km · 10 min",
    description:
      "Una ermita del siglo XV empotrada en la roca del acantilado, sobre una cala pequeña. La foto de Cantabria, y tu playa más cercana. Ve con marea baja: con la alta, la arena desaparece.",
    meta: [
      { label: "Entrada", value: "gratis" },
      { label: "Ojo", value: "consulta la tabla de mareas" },
      { label: "Reserva", value: "no" },
    ],
  },
  {
    n: 4,
    name: "Suances",
    distance: "10 km · 14 min",
    description:
      "Playa de la Concha y de Los Locos. Si hace buen día, recomendable tomar algo en el Castillo de los Locos, con unas vistas increíbles — también se puede desayunar. El chiringuito de Los Locos también muy recomendable.",
    meta: [
      { label: "Entrada", value: "gratis" },
      { label: "Socorristas", value: "julio y agosto" },
      { label: "Reserva", value: "no" },
      { label: "Aparcar", value: "difícil en agosto, ve antes de las 11:00" },
    ],
  },
  {
    n: 5,
    name: "Cartes",
    distance: "17 km · 20 min",
    description:
      "Una sola calle medieval con soportales y casonas blasonadas sobre el Besaya, y la torre del siglo XIV. Media hora, y casi siempre para ti solo.",
    meta: [
      { label: "Entrada", value: "gratis" },
      { label: "Horario", value: "libre" },
      { label: "Reserva", value: "no" },
    ],
  },
  {
    n: 6,
    name: "Cabezón de la Sal y el bosque de secuoyas",
    distance: "18 km · 20 min",
    description:
      "Un bosquete de secuoyas gigantes plantado en los años cuarenta, en Monte Cabezón. Paseo llano de veinte minutos entre troncos de sesenta metros. Perfecto con niños y con lluvia.",
    meta: [
      { label: "Entrada", value: "gratis" },
      { label: "Horario", value: "libre" },
      { label: "Reserva", value: "no" },
      { label: "Aparcar", value: "gratis junto a la CA-135" },
    ],
  },
  {
    n: 7,
    name: "Comillas",
    distance: "18 km · 20 min",
    description:
      "El Capricho de Gaudí, el Palacio de Sobrellano, la Universidad Pontificia y el cementerio con el ángel de Llimona. Modernismo catalán frente al Cantábrico. Se hace en medio día largo.",
    meta: [
      { label: "El Capricho", value: "~7 € · Sobrellano ~3 € · pueblo gratis" },
      {
        label: "Horario",
        value: "El Capricho 10:30–20:00 en verano, 10:30–17:30 en invierno",
      },
      { label: "Reserva", value: "recomendable en agosto" },
    ],
  },
];

export const bloque2: Poi[] = [
  {
    n: 8,
    name: "Playa de Oyambre",
    distance: "23 km · 25 min",
    description:
      "Kilómetro y medio de arena abierta dentro del Parque Natural de Oyambre, con dunas y prados verdes cayendo hasta el mar. La mejor playa larga de la zona.",
    meta: [
      { label: "Entrada", value: "gratis" },
      { label: "Aparcar", value: "de pago en verano, ~3 €/día" },
      { label: "Reserva", value: "no" },
    ],
  },
  {
    n: 9,
    name: "Ruente y La Fuentona",
    distance: "25 km · 27 min",
    description:
      "El manantial que brota bajo el puente de piedra y da nombre al pueblo, con la leyenda de la anjana. Entrada al valle de Cabuérniga y buenas casas de comidas para el cocido montañés.",
    meta: [
      { label: "Entrada", value: "gratis" },
      { label: "Horario", value: "libre" },
      { label: "Reserva", value: "solo para comer, sí" },
    ],
  },
  {
    n: 10,
    name: "Dunas de Liencres y Costa Quebrada",
    distance: "26 km · 26 min",
    description:
      "El sistema dunar mejor conservado del norte, con pinar detrás y la desembocadura del Pas. Enlaza con los acantilados de Costa Quebrada y el faro de Cabo Mayor camino de Santander.",
    meta: [
      { label: "Entrada", value: "gratis" },
      { label: "Horario", value: "libre" },
      { label: "Reserva", value: "no" },
    ],
  },
  {
    n: 11,
    name: "San Vicente de la Barquera",
    distance: "29 km · 30 min",
    description:
      "Puerto pesquero con castillo, la iglesia de los Ángeles y el puente de la Maza sobre la ría, con los Picos de Europa al fondo. Si vas en Semana Santa, la procesión marinera de La Folía.",
    meta: [
      { label: "Castillo", value: "~1,50 € · pueblo gratis" },
      { label: "Horario", value: "castillo 11:00–14:00 y 16:00–19:00" },
      { label: "Reserva", value: "no" },
    ],
  },
  {
    n: 12,
    name: "Cuevas de Monte Castillo · Puente Viesgo",
    distance: "30 km · 30 min",
    highlight: true,
    description:
      "Arte rupestre original, no réplica, y también Patrimonio de la Humanidad: El Castillo conserva las manos en negativo más antiguas de Europa. Las Monedas se visita en el mismo monte. Cupos muy pequeños.",
    meta: [
      { label: "Entrada", value: "~3 € por cueva · reducida ~1,50 €" },
      { label: "Horario", value: "mar.–dom., pases guiados cada 30–45 min" },
      { label: "Reserva", value: "imprescindible, teléfono 942 598 425" },
      { label: "Duración", value: "45 min" },
    ],
  },
  {
    n: 13,
    name: "Santander",
    distance: "30 km · 30 min",
    description:
      "Centro Botín, Península de la Magdalena, el Sardinero y el paseo de Pereda. Con niños, el Museo Marítimo del Cantábrico. Aparca en un parking del centro y muévete a pie.",
    meta: [
      { label: "Centro Botín", value: "~8 € · Museo Marítimo ~9 € · Magdalena gratis" },
      { label: "Horario", value: "Botín mar.–dom. 10:00–20:00" },
      { label: "Reserva", value: "no" },
    ],
  },
  {
    n: 14,
    name: "Bosque de Ucieda",
    distance: "30 km · 35 min",
    description:
      "Robledal y hayedo en el Parque Natural Saja-Besaya, con área recreativa junto al río Bayones. Rutas señalizadas fáciles de 1 a 3 horas. Espectacular en otoño.",
    meta: [
      { label: "Entrada", value: "gratis" },
      { label: "Horario", value: "libre" },
      { label: "Reserva", value: "no" },
      { label: "Aparcar", value: "gratis en el área recreativa" },
    ],
  },
  {
    n: 15,
    name: "Cueva de El Soplao",
    distance: "33 km · 40 min",
    highlight: true,
    description:
      "Excéntricas y helictitas que desafían la gravedad, en veinte kilómetros de galerías de una antigua mina de zinc. Se entra en tren minero y el recorrido turístico es accesible en silla de ruedas. Dentro hace 12 °C: lleva chaqueta.",
    meta: [
      {
        label: "Entrada",
        value: "adulto 15 € · niño 4–16 12,50 € · reducida 12 € · menores de 4 gratis",
      },
      { label: "Aventura", value: "espeleológica 36 € · ferrata minera 40 €" },
      { label: "Horario", value: "abierto todo el año en pases con aforo" },
      { label: "Reserva", value: "sí, se agota" },
      { label: "Duración", value: "1 h" },
    ],
  },
  {
    n: 16,
    name: "Carmona",
    distance: "38 km · 45 min",
    description:
      "Conjunto Histórico en pleno valle de Cabuérniga: casonas montañesas de piedra y madera con solanas corridas, todas orientadas al sur. Vive de la albarca y del ganado tudanco.",
    meta: [
      { label: "Entrada", value: "gratis" },
      { label: "Horario", value: "libre" },
      { label: "Reserva", value: "no" },
    ],
  },
  {
    n: 17,
    name: "Parque de la Naturaleza de Cabárceno",
    distance: "45 km · 42 min",
    highlight: true,
    description:
      "750 hectáreas de antigua mina de hierro con más de cien especies en semilibertad. Se recorre en tu propio coche por carreteras interiores, y el telecabina va incluido. Día completo; lleva comida y llega a la apertura.",
    meta: [
      {
        label: "Entrada",
        value: "adulto 25/35/45 € según temporada · niño 4–12 15/20/25 € · menores de 4 gratis",
      },
      { label: "Descuentos", value: "−10 % familia numerosa y mayores de 65, solo en taquilla" },
      { label: "Horario", value: "jul.–ago. 9:30–18:30 · resto 9:30–18:45 · invierno 10:00–17:45" },
      { label: "Reserva", value: "no obligatoria, pero compra en la web oficial" },
    ],
  },
  {
    n: 18,
    name: "Bárcena Mayor",
    distance: "48 km · 1 h",
    description:
      "El pueblo más antiguo de Cantabria, dentro de la Reserva del Saja: piedra, madera y ni un solo edificio moderno. Los últimos quince kilómetros son de carretera estrecha y revirada, y merecen la pena.",
    meta: [
      { label: "Entrada", value: "gratis" },
      { label: "Aparcar", value: "de pago a la entrada, ~2 €; el pueblo es peatonal" },
      { label: "Reserva", value: "sí para comer, los mesones se llenan" },
    ],
  },
];

export const bloque3: Poi[] = [
  {
    n: 19,
    name: "Desfiladero de La Hermida y Santa María de Lebeña",
    distance: "60 km · 1 h 05",
    description:
      "Veinte kilómetros de garganta caliza de paredes verticales siguiendo el Deva, con la iglesia mozárabe de Lebeña a mitad de camino.",
    meta: [
      { label: "Entrada", value: "gratis · Lebeña ~2 €" },
      { label: "Reserva", value: "no" },
    ],
  },
  {
    n: 20,
    name: "Reinosa, Julióbriga y Fontibre",
    distance: "70 km · 55 min",
    description:
      "Ciudad romana de Julióbriga, el nacimiento del Ebro en Fontibre y el embalse del Ebro. Campoo en estado puro.",
    meta: [
      { label: "Julióbriga", value: "~3 €" },
      { label: "Fontibre", value: "gratis" },
      { label: "Reserva", value: "no" },
    ],
  },
  {
    n: 21,
    name: "Potes y el monasterio de Santo Toribio de Liébana",
    distance: "75 km · 1 h 15",
    highlight: true,
    description:
      "La capital de Liébana, con la torre del Infantado y el puente sobre el Quiviesa. A cuatro kilómetros, Santo Toribio custodia el Lignum Crucis, el mayor fragmento conservado de la Cruz — uno de los cinco lugares santos del cristianismo.",
    meta: [
      { label: "Monasterio", value: "gratis · Torre del Infantado ~4 €" },
      { label: "Horario", value: "monasterio 10:00–13:00 y 16:00–19:00" },
      { label: "Reserva", value: "no" },
      { label: "Comer", value: "cocido lebaniego y orujo" },
    ],
  },
  {
    n: 22,
    name: "Alto Campoo y el Pico Tres Mares",
    distance: "85 km · 1 h 20",
    description:
      "Estación de esquí en invierno y telesilla panorámica en verano hasta los 2.175 m, donde nacen aguas que van al Cantábrico, al Atlántico y al Mediterráneo.",
    meta: [
      { label: "Telesilla", value: "~9 € ida y vuelta" },
      { label: "Horario", value: "verano 10:00–17:00" },
      { label: "Reserva", value: "no" },
    ],
  },
  {
    n: 23,
    name: "Santoña, Laredo y Noja",
    distance: "85 km · 1 h",
    description:
      "La costa oriental: las marismas de Santoña con sus anchoas, la playa de La Salvé en Laredo y el faro del Caballo con sus 763 escalones.",
    meta: [
      { label: "Entrada", value: "gratis" },
      { label: "Reserva", value: "no" },
    ],
  },
  {
    n: 24,
    name: "Teleférico de Fuente Dé",
    distance: "98 km · 1 h 35",
    highlight: true,
    description:
      "753 metros de desnivel en cuatro minutos hasta El Cable, a 1.823 m, en pleno Parque Nacional de Picos de Europa. Sube a primera hora: la niebla entra rápido y tapa todo.",
    meta: [
      { label: "Temporada alta", value: "adulto 30 € i/v · 17 € un trayecto · infantil 15 € i/v" },
      { label: "Temporada baja", value: "adulto 20 € i/v · 13 € un trayecto · infantil 8 € i/v" },
      { label: "Reserva", value: "online 24 h antes, por franja horaria" },
    ],
  },
  {
    n: 25,
    name: "Cuevas de Covalanas · Ramales de la Victoria",
    distance: "100 km · 1 h 15",
    description:
      "Ciervas rojas punteadas hace 20.000 años, vistas a la luz de linterna en grupos de ocho. Patrimonio de la Humanidad y una de las visitas rupestres más íntimas que existen.",
    meta: [
      { label: "Entrada", value: "~3 €" },
      { label: "Reserva", value: "imprescindible" },
      { label: "Ojo", value: "15 min de subida a pie hasta la boca" },
    ],
  },
  {
    n: 26,
    name: "Castro Urdiales",
    distance: "105 km · 1 h 10",
    description:
      "Iglesia gótica de Santa María, castillo-faro y puente medieval formando el conjunto marinero más fotogénico de la costa oriental.",
    meta: [
      { label: "Entrada", value: "gratis" },
      { label: "Reserva", value: "no" },
    ],
  },
];

export const bloque4: Poi[] = [
  {
    n: 27,
    name: "Llanes (Asturias)",
    distance: "78 km · 55 min",
    description: "Los Cubos de la Memoria, el bufón de Arenillas y la playa de Gulpiyuri.",
  },
  {
    n: 28,
    name: "Covadonga y los Lagos",
    distance: "125 km · 1 h 45",
    description:
      "Santuario y lagos Enol y Ercina. De junio a septiembre la carretera se cierra: se sube en lanzadera (~9 €).",
  },
  {
    n: 29,
    name: "Bilbao",
    distance: "135 km · 1 h 30",
    description:
      "Guggenheim (~16 €, cerrado los lunes salvo verano), Casco Viejo y pintxos en la Plaza Nueva.",
  },
  {
    n: 30,
    name: "Oviedo y Gijón",
    distance: "155 km · 1 h 45",
    description: "Prerrománico asturiano en el Naranco y sidrerías. Día largo, mejor con noche fuera.",
  },
];

export const rutas = [
  {
    letra: "A",
    titulo: "Prehistoria y mar",
    distancia: "35 km en total · día suave",
    pasos:
      "Altamira a las 9:30 con entrada reservada → vuelta al pueblo a media mañana y Colegiata → comer en Santillana → playa de Santa Justa con la marea baja → puesta de sol en Suances.",
  },
  {
    letra: "B",
    titulo: "El día grande de Liébana",
    distancia: "205 km ida y vuelta · sal a las 8:00",
    pasos:
      "Desfiladero de La Hermida → Santa María de Lebeña → teleférico de Fuente Dé a media mañana, antes de la niebla → comer en Potes → Santo Toribio por la tarde → mirador de Santa Catalina a la vuelta.",
  },
  {
    letra: "C",
    titulo: "Bajo tierra y frente al mar",
    distancia: "90 km en total · día completo",
    pasos:
      "El Soplao en el primer pase de la mañana → bajada a San Vicente de la Barquera a comer pescado → playa de Oyambre → Comillas y el Capricho al atardecer.",
  },
  {
    letra: "D",
    titulo: "Los valles del Saja",
    distancia: "120 km en total · carretera lenta",
    pasos:
      "Ruente y La Fuentona → Carmona → Bárcena Mayor y cocido montañés reservado → bosque de Ucieda por la tarde → vuelta por Cabezón de la Sal y las secuoyas.",
  },
];

export const comerSinEquivocarse = [
  {
    plato: "Cocido montañés",
    texto: "Alubias, berza y compango. En los valles del Saja y en Ruente. Plato de invierno, aunque lo sirvan en agosto.",
  },
  {
    plato: "Rabas y anchoas",
    texto: "Calamar rebozado en cualquier bar de la costa; anchoas de Santoña, las mejores del mundo.",
  },
  {
    plato: "Sobaos y quesada",
    texto: "Del valle del Pas. Los sobaos con IGP llevan mantequilla de verdad y se nota.",
  },
  {
    plato: "Quesucos y picón",
    texto: "El queso de Tresviso y el Picón Bejes-Tresviso, azul y muy potente, en Liébana.",
  },
  {
    plato: "Cocido lebaniego",
    texto: "De garbanzos, en Potes. Se sirve en tres vuelcos y no vas a cenar.",
  },
  {
    plato: "Orujo de Potes",
    texto: "Blanco, de hierbas o de crema. La fiesta del orujo es en noviembre.",
  },
];

export const antesDeSalir = [
  {
    titulo: "Reservas que no se improvisan",
    texto:
      "Altamira, El Soplao, Puente Viesgo, Covalanas y el teleférico de Fuente Dé trabajan con cupos y franjas horarias. En julio y agosto se agotan con días de antelación. Compra siempre en la web oficial de cada sitio.",
  },
  {
    titulo: "El tiempo manda",
    texto:
      "Aquí llueve en cualquier mes. Guarda las cuevas y los museos para los días grises y la costa y la montaña para los claros. Las mejores épocas: de mayo a junio y septiembre. Agosto tiene el mejor tiempo y las peores colas.",
  },
  {
    titulo: "Aparcar",
    texto:
      "Estando dentro de Santillana, lo mejor es dejar el coche quieto y salir andando. Comillas, Bárcena Mayor y las playas cobran parking en verano, entre 2 y 5 € el día; llegar antes de las once resuelve casi todo. En Cabárceno el coche entra contigo al parque.",
  },
  {
    titulo: "Con niños",
    texto:
      "Lo que nunca falla: Cabárceno, El Soplao en tren minero, las secuoyas de Cabezón y la playa de La Concha en Suances. Altamira funciona bien a partir de los seis años.",
  },
];

// ---------------------------------------------------------------------------
// Restaurantes

export const restaurantesPorDistancia: Restaurant[] = [
  { name: "Pizzería Bitinia", place: "Santillana del Mar", km: "0 km", time: "a pie", tags: ["Pizza"], description: "Pizza napolitana · horno de piedra" },
  { name: "Restaurante El Castillo", place: "Santillana del Mar", km: "0 km", time: "a pie", tags: [], description: "Arroz con bogavante · menú del día" },
  { name: "Restaurante Gran Duque", place: "Santillana del Mar", km: "0 km", time: "a pie", tags: [], description: "Cocina cántabra clásica desde 2001" },
  { name: "El Bisonte Rojo", place: "Santillana del Mar", km: "0 km", time: "2 min", tags: [], description: "Cocina tradicional · jardín familiar" },
  { name: "La Nueva Santuca", place: "Arroyo (Santillana)", km: "2 km", time: "5 min", tags: ["TOP"], top: true, description: "Cocina cántabra de nivel" },
  { name: "El Cairo", place: "Suances", km: "6 km", time: "10 min", tags: ["Burger"], description: "Hamburguesas artesanas" },
  { name: "La Choquería", place: "Suances", km: "6 km", time: "10 min", tags: [], description: "Arroces · pescado a la brasa · vistas playa" },
  { name: "El Marinero", place: "Suances", km: "6 km", time: "10 min", tags: [], description: "Pescados del día · cocina marinera" },
  { name: "La Dársena", place: "Suances", km: "6 km", time: "10 min", tags: [], description: "Paellas · marisco · junto al puerto" },
  { name: "Amita", place: "Suances", km: "6 km", time: "10 min", tags: [], description: "Marisco y pescado · nivel y presentación" },
  { name: "La Bodega de Sidro", place: "Suances", km: "6 km", time: "10 min", tags: [], description: "Marisquería · vermú · puerto" },
  { name: "Mesón El Tropezón", place: "La Herrería (Valdáliga)", km: "15 km", time: "18 min", tags: [], description: "Cocido montañés · caza · chimenea" },
  { name: "Buffalo Burger", place: "Corrales de Buelna", km: "18 km", time: "20 min", tags: ["Burger"], description: "Smash burger y medallón" },
  { name: "El Hostal del Pericote", place: "Oruña de Piélagos", km: "20 km", time: "20 min", tags: ["Carne"], description: "Carnes maduradas a la parrilla" },
  { name: "La Casona de Nori", place: "Collado de Cieza", km: "22 km", time: "25 min", tags: [], description: "Cocina casera · ganadería propia · vistas" },
  { name: "Buena Burger", place: "Santander", km: "28 km", time: "30 min", tags: ["Burger"], description: "Smash burger" },
  { name: "Vestia Napoletana", place: "Santander", km: "28 km", time: "30 min", tags: ["Pizza"], description: "Pizza napolitana · masa larga fermentación" },
  { name: "El Riojano — Bodega del Riojano", place: "Santander", km: "28 km", time: "30 min", tags: [], description: "Cocina de mercado · bodega histórica" },
  { name: "Asador Origen", place: "Santander", km: "28 km", time: "30 min", tags: [], description: "Carnes a la brasa · tomahawk" },
  { name: "Kandela", place: "Santander", km: "28 km", time: "30 min", tags: [], description: "Cocina de autor · producto cántabro" },
  { name: "El Tronki", place: "Cantabria", km: "28 km", time: "30 min", tags: [], description: "Pescados del Cantábrico a la parrilla" },
  { name: "Daría", place: "Cantabria", km: "28 km", time: "30 min", tags: [], description: "Cocina tradicional cántabra" },
  { name: "La Taberna del Valle de Cabuérniga", place: "Valle de Cabuérniga", km: "30 km", time: "35 min", tags: [], description: "Arroces · carne Tudanca" },
  { name: "El Puente en Carmona", place: "Carmona", km: "32 km", time: "38 min", tags: [], description: "Cocina casera · producto propio · 4.6★" },
  { name: "Casa Cofiño", place: "Caviedes", km: "34 km", time: "35 min", tags: ["Cocido"], description: "Cocido montañés · bodega 700 ref." },
  { name: "Mesón Dos Pozos y Jimena", place: "Sta. Cruz de Bezana", km: "35 km", time: "35 min", tags: ["Cachopo"], description: "Mejor cachopo Cantabria 2024/25 · XXL" },
  { name: "Palacio de Arce", place: "Puente Arce", km: "35 km", time: "35 min", tags: ["TOP"], top: true, description: "Cocina de autor en palacio s. XVII · 9.6/10" },
  { name: "Casa Poli", place: "Vidiago, Llanes (Asturias)", km: "47 km", time: "45 min", tags: ["Cachopo"], description: "Cachopo asturiano legendario · sin reserva" },
  { name: "Pepillos Pizza", place: "Escalante", km: "65 km", time: "50 min", tags: ["Pizza"], description: "Pizza artesana · jardín rural · reservar" },
];

export const restaurantesDestacados: Restaurant[] = [
  {
    name: "Pizzería Bitinia",
    place: "Plaza del Rey · Santillana del Mar",
    km: "0 km",
    time: "a pie",
    favorito: true,
    tags: ["TOP pizzas", "Horno de piedra", "Soportales Plaza del Rey"],
    description:
      "La mejor pizza de Santillana, bajo los soportales de la Plaza del Rey. Masa de larga fermentación, producto italiano de calidad y un punto de horno impecable. Más de una década en el mismo sitio sin bajar el nivel.",
    note: "Local pequeño — llegar pronto o reservar.",
  },
  {
    name: "Restaurante El Castillo",
    place: "Plaza Mayor, 6 · Santillana del Mar",
    km: "0 km",
    time: "a pie",
    tags: ["Arroz con bogavante", "Menú del día", "Terraza Plaza Mayor"],
    description:
      "En la Plaza Mayor, frente al Ayuntamiento. Cocina casera generosa: arroz con bogavante como especialidad estrella, pescados salvajes y carnes de la zona. Menú del día con muy buena relación calidad-precio.",
  },
  {
    name: "Restaurante Gran Duque",
    place: "C/ Escultor Jesús Otero, 7 · Santillana del Mar",
    km: "0 km",
    time: "a pie",
    tags: ["Clásico desde 2001", "Carnes y pescados", "Buena bodega"],
    description:
      "Clásico de referencia desde 2001. Carnes de la tierra, pescados y marisco del Cantábrico, carrilleras de jabalí y arroz marinero. Ambiente rústico con vigas de madera y bodega bien surtida.",
  },
  {
    name: "El Bisonte Rojo",
    place: "Av. del Alcalde Antonio Sandi, 6 · Santillana del Mar",
    km: "0 km",
    time: "2 min",
    tags: ["Desde 1960", "Jardín y parque infantil", "4.5★ Google"],
    description:
      "Restaurante familiar desde 1960. Cocina tradicional cántabra: cocido montañés, cachopo de cecina, ensalada de burrata y tarta de queso casera. Jardín amplio con zona infantil, ideal para familias.",
  },
  {
    name: "La Nueva Santuca",
    place: "Barrio Arroyo, 7 · Arroyo (Santillana)",
    km: "2 km",
    time: "5 min",
    top: true,
    tags: ["TOP del área", "Fine dining rural", "Reserva obligatoria"],
    description:
      "El mejor de la zona. Cocina cántabra y mediterránea de nivel, en casona rural de entorno muy cuidado. Carta de temporada, buena bodega, atención excelente. Para cenas o almuerzos especiales de los que se recuerdan.",
  },
  {
    name: "El Cairo",
    place: "Suances",
    km: "6 km",
    time: "10 min",
    tags: ["Top burger #3", "Ambiente playero"],
    description:
      "La referencia de hamburguesa en Suances. Propuesta directa y sin adornos pero con buen producto. La opción perfecta después de un día de playa en Los Locos.",
  },
  {
    name: "Mesón El Tropezón",
    place: "Barrio La Herrería · Valdáliga",
    km: "15 km",
    time: "18 min",
    tags: ["Cocido montañés", "Caza", "Chimenea", "Precio económico"],
    description:
      "Mesón rural de cocina montañesa. Cocido montañés, carnes a la piedra y platos de caza en raciones generosas y precios muy contenidos. Comedor con chimenea, ambiente familiar auténtico.",
  },
  {
    name: "El Hostal del Pericote",
    place: "Barrio El Puente, 13 · Oruña de Piélagos",
    km: "20 km",
    time: "20 min",
    tags: ["Para comer bien", "Carnes maduradas", "Ganadería propia"],
    description:
      "Una de las grandes referencias de carne en Cantabria. Casona montañesa con ganadería propia: chuletones madurados, solomillos y entrecots a la parrilla.",
    note: "Reservar siempre. Ubicación actual: Oruña de Piélagos (trasladó desde Tanos).",
  },
];

export const restaurantesPorCategoria = [
  {
    categoria: "Pizzas napolitanas",
    subtitulo: "Los tres mejores sitios de pizza de Cantabria",
    color: "bg-[#7a1f3d]",
    items: [
      { nombre: "Pizzería Bitinia", lugar: "Santillana del Mar · a pie", texto: "La más cercana. Masa de larga fermentación, horno de piedra bajo los soportales de la Plaza del Rey." },
      { nombre: "Vestia Napoletana", lugar: "Santander · 28 km · 30 min", texto: "La referencia napolitana de Santander: masa de fermentación larga, horno de piedra a alta temperatura." },
      { nombre: "Pepillos Pizza", lugar: "Escalante · 65 km · 50 min", texto: "Pizzería artesana en jardín rural junto a las marismas de Santoña. Reservar por WhatsApp, solo noche." },
    ],
  },
  {
    categoria: "Hamburguesas",
    subtitulo: "Top 3 de Cantabria",
    color: "bg-stone-800",
    items: [
      { nombre: "Buena Burger", lugar: "Santander · 28 km", texto: "La smash burger de referencia en Cantabria. Carne aplastada en plancha muy caliente, pan artesano." },
      { nombre: "Buffalo Burger", lugar: "Corrales de Buelna · 18 km · 20 min", texto: "Smash burger crujiente y medallón clásico jugoso. Buena variedad de salsas." },
      { nombre: "El Cairo", lugar: "Suances · 6 km · 10 min", texto: "La más cercana al apartamento y perfecta después de un día de playa." },
    ],
  },
  {
    categoria: "Carnes a la brasa y parrilla",
    subtitulo: "Para cuando se quiere comer carne de verdad",
    color: "bg-amber-800",
    items: [
      { nombre: "El Hostal del Pericote", lugar: "Oruña de Piélagos · 20 km · 20 min", texto: "Ganadería propia: chuletones madurados, solomillos y entrecots. Reservar siempre." },
      { nombre: "Asador Origen", lugar: "Santander · 28 km · 30 min", texto: "El mejor asador contemporáneo de Cantabria según varios críticos: tomahawk, chuletón, parrilla vista." },
      { nombre: "El Puente en Carmona", lugar: "Carmona · 32 km · 38 min", texto: "Chuletón de producto propio en casona montañesa. 4.6★ en TripAdvisor." },
    ],
  },
  {
    categoria: "Cocido montañés",
    subtitulo: "El plato nacional de Cantabria — dónde comerlo bien",
    color: "bg-moss-700",
    items: [
      { nombre: "Casa Cofiño", lugar: "Caviedes · 34 km · 35 min", texto: "El templo. Desde 1963, el cocido más reputado de Cantabria. Bodega de +700 referencias. Reservar con antelación." },
      { nombre: "El Puente en Carmona", lugar: "Carmona · 32 km · 38 min", texto: "Cocido de elaboración 100% propia, con producto de la finca. Reservar siempre." },
      { nombre: "Mesón El Tropezón", lugar: "La Herrería · 15 km · 18 min", texto: "El más cercano y económico. La mejor relación calidad-precio de los tres." },
    ],
  },
  {
    categoria: "Pescados del Cantábrico",
    subtitulo: "El producto manda",
    color: "bg-sky-900",
    items: [
      { nombre: "El Tronki", lugar: "Cantabria · 28 km · 30 min", texto: "Joya para los pescados del Cantábrico a la parrilla: rape, rodaballo, besugo o merluza del día." },
      { nombre: "Restaurante El Castillo", lugar: "Santillana · a pie", texto: "Arroz con bogavante como especialidad estrella, pescados salvajes del día. Terraza en la Plaza Mayor." },
    ],
  },
  {
    categoria: "Suances · costa a 10 minutos",
    subtitulo: "Pescados, arroces y marisco",
    color: "bg-teal-800",
    items: [
      { nombre: "La Dársena", lugar: "C/ El Muelle, 23 · Suances", texto: "El más consolidado en pescados y marisco. Paellas, mejillones, langostinos. Considerado el mejor local costero de la villa." },
      { nombre: "Amita", lugar: "Suances", texto: "Marisco y pescado fresco con presentación actual. Para una comida más reposada y de mayor nivel." },
      { nombre: "El Marinero", lugar: "Suances", texto: "Cocina marinera de producto fresco, arroces y pescados del día. Ambiente tradicional." },
      { nombre: "La Choquería", lugar: "Paseo de la Marina Española, 9 · Suances", texto: "Tercera generación de la misma familia. Terraza frente a la Playa de la Concha." },
      { nombre: "La Bodega de Sidro", lugar: "C/ Acacio Gutiérrez, 159 · Suances", texto: "Marisquería acogedora en el puerto. Ideal para un vermú o una ración de rabas junto al agua." },
    ],
  },
  {
    categoria: "Cocina de autor y mercado",
    subtitulo: "",
    color: "bg-purple-900",
    items: [
      { nombre: "Palacio de Arce", lugar: "Puente Arce · 35 km · 35 min · ★ TOP", texto: "Dentro del Palacio del Marqués de la Conquista Real (s. XVII), Bien de Interés Cultural. Menú del día entre semana a 20 €. 9.6/10 en TheFork." },
      { nombre: "La Nueva Santuca", lugar: "Arroyo · 2 km · 5 min", texto: "TOP del área. Cocina cántabra y mediterránea de nivel en casona rural. Reservar con antelación." },
      { nombre: "Kandela & El Riojano", lugar: "Santander · 28 km · 30 min", texto: "Kandela: cocina de autor con producto cántabro. El Riojano: cocina de mercado, bodega histórica." },
    ],
  },
  {
    categoria: "Cocina casera de interior",
    subtitulo: "Casonas y mesas de pueblo donde la cocina es como la de siempre",
    color: "bg-amber-900",
    items: [
      { nombre: "La Casona de Nori", lugar: "Collado de Cieza · 22 km · 25 min", texto: "Ganadería propia. Cocido montañés, albóndigas de Tudanca, estofado y chuleta a la brasa. Menú del día a precio muy contenido." },
    ],
  },
  {
    categoria: "Cachopos",
    subtitulo: "Dos especiales imprescindibles",
    color: "bg-red-950",
    items: [
      { nombre: "Mesón Dos Pozos y Jimena", lugar: "Sta. Cruz de Bezana · 35 km · 35 min", texto: "Mejor cachopo de Cantabria 2024 y 2025. XXL de más de un kilo y medio. Reservar, se llena los fines de semana." },
      { nombre: "Casa Poli", lugar: "Vidiago, Llanes (Asturias) · 47 km · 45 min", texto: "Clásico asturiano desde 1996. Una de las mejores experiencias gastronómicas del norte de España. No acepta reservas — llegar a las 13:30." },
    ],
  },
];

// ---------------------------------------------------------------------------
// Actividades y planes al aire libre

export const actividadesPorDistancia = [
  { km: "0 km", nombre: "Paseos a caballo La Robleda", tiempo: "a pie · 2 min", lugar: "Av. Antonio Sandi s/n, Santillana del Mar", tipo: "Ecuestre · rutas y ponis", recomendado: true },
  { km: "0 km", nombre: "Paseos a caballo Allende", tiempo: "a pie", lugar: "Frente al claustro, Santillana del Mar", tipo: "Ecuestre · rutas · ponis para niños", recomendado: true },
  { km: "10 km", nombre: "Zink Pádel Sport Center", tiempo: "12 min", lugar: "Parque Emp. Besaya, Nave 1 · Reocín", tipo: "Pádel · 5 pistas indoor · tienda", recomendado: true },
  { km: "15 km", nombre: "CrossFit 39300 Torrelavega", tiempo: "18 min", lugar: "C/ Pablo Garnica, 27 · Torrelavega", tipo: "CrossFit · 800 m² · box oficial" },
  { km: "25 km", nombre: "Black Shark Surf School", tiempo: "25 min", lugar: "Barrio La Playa, 218B · Cóbreces", tipo: "Surf · camp · alojamiento · Luaña", recomendado: true },
  { km: "28 km", nombre: "Santander CrossFit", tiempo: "30 min", lugar: "Polígono Raos 31, Nave 9 · Santander", tipo: "CrossFit · +1.200 m² · HYROX", recomendado: true },
  { km: "28 km", nombre: "Motos de agua — Puerto de Raos", tiempo: "30 min", lugar: "Puerto Deportivo Marina · Raos, Santander", tipo: "Moto de agua · sin licencia · monitor" },
  { km: "28 km", nombre: "Kayak y SUP en la bahía de Santander", tiempo: "30 min", lugar: "Muelle Puertochico · Santander", tipo: "Kayak · SUP · vistas Magdalena" },
  { km: "35 km", nombre: "Ruta Costa Quebrada — Arnía", tiempo: "35 min", lugar: "Liencres, Piélagos", tipo: "Senderismo · geología única" },
  { km: "50 km", nombre: "Descenso del río Deva", tiempo: "50 min", lugar: "Panes — Liébana", tipo: "Canoa · desfiladero · espectacular" },
  { km: "55 km", nombre: "Descenso del río Sella", tiempo: "55 min", lugar: "Arriondas — Ribadesella, Asturias", tipo: "Canoa · ~12 km · verano" },
  { km: "90 km", nombre: "Senderismo Picos de Europa — Fuente Dé", tiempo: "1 h 20 min", lugar: "Fuente Dé, Liébana", tipo: "Montaña · teleférico · 1.823 m" },
];

export const actividadesDestacadas: Actividad[] = [
  {
    nombre: "Paseos a Caballo La Robleda",
    lugar: "Av. Antonio Sandi, s/n (junto al Restaurante El Bisonte Rojo) · Santillana del Mar",
    km: "0 km",
    tiempo: "a pie · 2 min",
    top: true,
    tags: ["Más cercano al apartamento", "Todos los niveles", "Ponis para niños"],
    descripcion:
      "Centro ecuestre justo en la Avenida Antonio Sandi, al lado del apartamento. Rutas y excursiones a caballo para todos los niveles, desde paseos relajados de una hora hasta jornadas de varios días. Caballos de temperamento dócil, y paseos en poni para los más pequeños con monitores expertos.",
    contacto: "Tel. 637 37 60 90",
    precio: "Paseo en poni desde 5 €",
    nota: "No hace falta reserva para los paseos en poni; para rutas a caballo, llamar antes.",
  },
  {
    nombre: "Rutas a Caballo y Paseos en Poni Allende",
    lugar: "Frente al claustro de la Colegiata · Santillana del Mar",
    km: "0 km",
    tiempo: "a pie",
    tags: ["Primera agencia ecuestre de Cantabria", "Rutas guiadas", "Poni Club"],
    descripcion:
      "La primera agencia de actividades ecuestres de Cantabria, frente al claustro de la Colegiata. Rutas para principiantes y jinetes con experiencia, y Poni Club especializado para niños. Ideal para familias — se puede combinar con una visita al casco histórico el mismo día.",
  },
  {
    nombre: "Black Shark Surf School & Surf House",
    lugar: "Barrio La Playa, 218B · Cóbreces (Alfoz de Lloredo)",
    km: "25 km",
    tiempo: "25 min",
    top: true,
    tags: ["Escuela oficial de surf", "A 50 m de la playa de Luaña", "Alojamiento incluido"],
    descripcion:
      "La escuela de surf de Raúl en la playa de Luaña, entre Santillana del Mar y Comillas. Clases sueltas, pack fin de semana, pack semanal y surf camp de niños en julio (6 a 15 años). Monitores titulados, grupos máximo de 6 alumnos, todo el equipo incluido.",
    contacto: "Tel. 640 95 77 39 · info@blackshark.surf",
    nota: "Playa de Luaña con Bandera Azul, aparcamiento y duchas.",
  },
  {
    nombre: "Zink Pádel Sport Center",
    lugar: "Parque Empresarial Besaya, Parcela D, Nave 1 · Reocín",
    km: "10 km",
    tiempo: "12 min",
    top: true,
    tags: ["5 pistas indoor", "Tienda especializada", "Zona social 200 m²"],
    descripcion:
      "Club de pádel de referencia en la zona: 5 pistas indoor de cristal, tienda especializada y zona de relax con TV. Si necesitas material o quieres organizar un partido, contacta directamente — siempre hay gente buscando partidos.",
    contacto: "Tel. 682 640 534 / 942 735 958 · zinkpadel@gmail.com",
  },
  {
    nombre: "CrossFit 39300 — Torrelavega",
    lugar: "C/ Pablo Garnica, 27 · Torrelavega",
    km: "15 km",
    tiempo: "18 min",
    tags: ["Box oficial CrossFit", "800 m²", "5/5 en Google"],
    descripcion:
      "El primer box oficial de CrossFit en Torrelavega, 800 m² de estilo industrial. Horario amplio de lunes a domingo, drop-in disponible para visitantes previa confirmación.",
    contacto: "Tel. 623 599 949 · box39300@gmail.com",
  },
  {
    nombre: "Santander CrossFit",
    lugar: "Polígono de Raos 31, Nave 9 (junto a ITV) · Santander",
    km: "28 km",
    tiempo: "30 min",
    top: true,
    tags: ["+1.200 m²", "HYROX", "Halterofilia · Open Box"],
    descripcion:
      "Box de CrossFit en el Polígono de Raos, el mismo punto de salida que las motos de agua — se pueden combinar en el mismo día. CrossFit, halterofilia, HYROX, gimnasio y Open Box.",
    contacto: "santandercrossfit@outlook.es",
  },
  {
    nombre: "Trave Sea — Alquiler de Embarcaciones",
    lugar: "Bahía de Santander",
    km: "28 km",
    tiempo: "30 min",
    top: true,
    tags: ["Alquiler de embarcaciones", "Rutas por la bahía", "Sin necesidad de titulación"],
    descripcion:
      "Alquiler de embarcaciones para recorrer la Bahía de Santander a tu ritmo: rutas guiadas, planes gastronómicos y salidas de ocio por el agua, con la Península de la Magdalena y El Sardinero de fondo.",
    nota: "Consulta rutas, precios y disponibilidad en trave-sea.com.",
  },
  {
    nombre: "Motos de agua — Puerto Deportivo de Raos",
    lugar: "Marina del Cantábrico · Polígono de Raos · Santander",
    km: "28 km",
    tiempo: "30 min",
    tags: ["Sin licencia necesaria", "Monitor incluido", "Hasta 2 personas por moto"],
    descripcion:
      "Recorre la bahía de Santander en moto de agua, con vistas al Palacio de la Magdalena y el Sardinero. No hace falta titulación: un monitor va delante abriendo camino. Todo incluido (chaleco, neopreno, briefing). Apto desde 16 años.",
    precio: "~70 €/30 min · ~110 €/1 hora · descuento grupos de 4–8 motos",
    nota: "Reservar con antelación en verano.",
  },
  {
    nombre: "Descenso del río Sella",
    lugar: "Arriondas — Ribadesella, Asturias",
    km: "55 km",
    tiempo: "55 min",
    tags: ["Experiencia única", "~12 km de río", "Apto desde 6 años"],
    descripcion:
      "Uno de los descensos fluviales más famosos de España: ~12 km en canoa biplaza desde Arriondas hasta Ribadesella, entre bosques de ribera y paredes de roca. Las empresas incluyen transporte de vuelta. Temporada primavera–otoño.",
    nota: "Reservar con antelación en agosto. Dura entre 3 y 5 horas.",
  },
  {
    nombre: "Descenso del río Deva",
    lugar: "Panes — Valle de Liébana",
    km: "50 km",
    tiempo: "50 min",
    tags: ["Desfiladero espectacular", "Paredes de 2.000 m", "Más salvaje que el Sella"],
    descripcion:
      "El Deva discurre por el impresionante Desfiladero de La Hermida, entre paredes que alcanzan los 2.000 metros. Combina tramos tranquilos con rápidos suaves. Se puede combinar con una visita a Potes y el Valle de Liébana el mismo día.",
  },
];

export const actividadesOtras = [
  {
    titulo: "Kayak y SUP en la bahía de Santander",
    texto:
      "28 km · 30 min. Recorre en kayak o SUP la bahía con vistas al Palacio de la Magdalena. Alquiler en el muelle de Puertochico.",
  },
  {
    titulo: "Ruta Costa Quebrada — Arnía",
    texto:
      "35 km · 35 min. Sendero de 8–10 km entre los Urros de Liencres y la playa de la Arnía, entre acantilados únicos. Llevar calzado antideslizante y ir con marea baja.",
  },
  {
    titulo: "Picos de Europa — Fuente Dé",
    texto:
      "90 km · 1 h 20 min. Teleférico hasta los 1.823 m con vistas panorámicas. Reservar en cantur.es en temporada alta.",
  },
];

export const consejoActividades =
  "Surf, kayak y motos de agua: mejor junio–septiembre. Descensos del Sella y Deva: abril–octubre. Senderismo en Picos: junio–octubre. Pádel y CrossFit disponibles todo el año. Caballos, también todo el año — el entorno otoñal e invernal de Santillana tiene su propio encanto. Para cualquiera de estas actividades puedes contactar con nosotros directamente: te ayudamos a organizarla y resolvemos tus dudas según disponibilidad.";

// ---------------------------------------------------------------------------
// Playas

export type Playa = {
  n: number;
  nombre: string;
  lugar: string;
  tiempo: string;
  descripcion: string;
  chiringuito?: string;
  tags: string[];
};

export const playas: Playa[] = [
  {
    n: 1,
    nombre: "Playa de Santa Justa",
    lugar: "Ubiarco",
    tiempo: "aprox. 10 min desde Santillana",
    descripcion:
      "La más cercana y singular: una pequeña cala dorada con una ermita encajada en la roca que le da un aire mágico. Acceso a través de un sendero entre prados con vistas espectaculares.",
    tags: ["Cala pequeña", "Muy cerca", "Tranquila"],
  },
  {
    n: 2,
    nombre: "Playa de Los Locos",
    lugar: "Suances",
    tiempo: "aprox. 20 min desde Santillana",
    descripcion:
      "El paraíso del surf en Cantabria, con oleaje intenso y un paisaje de acantilados muy fotogénico. Buen ambiente joven y paseo marítimo cercano con vida por la tarde-noche.",
    chiringuito:
      "En el paseo de Suances hay varios chiringuitos con terraza frente al mar, ideales para tapear viendo a los surfistas.",
    tags: ["Surf", "Ambiente joven", "Paseo marítimo"],
  },
  {
    n: 3,
    nombre: "Playa de la Arnía",
    lugar: "Liencres (Piélagos)",
    tiempo: "aprox. 35 min desde Santillana",
    descripcion:
      "Una de las playas más espectaculares de Cantabria, dentro del Parque Geológico de la Costa Quebrada. Islotes rocosos (los Urros de Liencres) y piscinas naturales según la marea.",
    chiringuito:
      "Chiringuito El Cazurro, justo en el acceso a la playa: pulpo a la gallega, croquetas de calamar en su tinta. Recomendable reservar en temporada alta.",
    tags: ["Paisaje único", "Fotogénica", "Algo más alejada"],
  },
  {
    n: 4,
    nombre: "Playa de Oyambre",
    lugar: "San Vicente de la Barquera",
    tiempo: "aprox. 30 min desde Santillana",
    descripcion:
      "Dentro del Parque Natural de Oyambre, un arenal de 2 km de arena fina y dorada con dunas y oleaje moderado. Una de las playas mejor conservadas de la región.",
    tags: ["Arenal extenso", "Parque natural", "Apta para baño"],
  },
  {
    n: 5,
    nombre: "Playa de Comillas",
    lugar: "Comillas",
    tiempo: "aprox. 25 min desde Santillana",
    descripcion:
      "Combina playa y patrimonio: desde la arena se ve el puerto pesquero y los edificios modernistas de la villa, como el Palacio de Sobrellano. Ideal para combinar con El Capricho de Gaudí.",
    tags: ["Playa + patrimonio", "Modernismo", "Casco histórico cerca"],
  },
  {
    n: 6,
    nombre: "Playa de Tagle",
    lugar: "Suances",
    tiempo: "aprox. 20 min desde Santillana",
    descripcion:
      "Playa más salvaje y menos masificada que sus vecinas Los Locos y La Concha, flanqueada por rocas. Arena dorada, oleaje consistente y atardeceres espectaculares.",
    chiringuito:
      "Chiringuito de los Locos: tortilla de patatas muy reputada, rabas y bocartes fritos. El Castillo de los Locos: terraza-bar ideal para cenar viendo el atardecer — conviene llegar con tiempo.",
    tags: ["Surf", "Ambiente joven", "Mejor atardecer de Suances"],
  },
  {
    n: 7,
    nombre: "Gerra · El Rayo Verde",
    lugar: "Entre San Vicente de la Barquera y Comillas",
    tiempo: "aprox. 30 min desde Santillana",
    descripcion:
      "Sobre una colina con vistas a la Ría de la Rabia, la playa de Oyambre y los Picos de Europa al fondo. Uno de los grandes referentes de Cantabria para ver el atardecer en verano.",
    chiringuito:
      "El Rayo Verde: espacio gastronómico y cultural con cócteles artesanales, cocina de producto fresco y música en vivo en temporada alta. Puede masificarse en pleno verano.",
    tags: ["El mejor atardecer de la costa", "Gastronomía cuidada"],
  },
  {
    n: 8,
    nombre: "Zona de Liencres (Dunas y Costa Quebrada)",
    lugar: "Liencres (Piélagos)",
    tiempo: "aprox. 35 min desde Santillana",
    descripcion:
      "Uno de los enclaves dunares más importantes del litoral cantábrico, con una sucesión de calas encadenadas por sendas costeras — Somocuevas, Portío, Cerrias, El Madero.",
    tags: ["Dunas", "Ruta de calas", "Naturaleza"],
  },
  {
    n: 9,
    nombre: "Playa de Luaña",
    lugar: "Cóbreces",
    tiempo: "aprox. 25 min desde Santillana",
    descripcion:
      "Arenal amplio de 400 metros con Bandera Azul, rodeado de colinas verdes y acantilados, en un entorno rural muy auténtico.",
    chiringuito:
      "Restaurante Playa Luaña, a pie de playa: tataki de atún, arroces, pescado del día. Precio algo más elevado, justificado por la ubicación.",
    tags: ["Bandera Azul", "Entorno rural", "Tranquila"],
  },
  {
    n: 10,
    nombre: "Playa de Cuchía (Marzán)",
    lugar: "Miengo",
    tiempo: "aprox. 30 min desde Santillana",
    descripcion:
      "Playa familiar y muy tranquila en la desembocadura de la ría de San Martín de la Arena, con aguas protegidas y poco oleaje. Accesos adaptados, ideal con niños o gente mayor.",
    chiringuito:
      "El Chiringuito de Cuchía: zamburiñas, arroz con carabineros, pulpo a la gallega. Algo más caro pero con muy buena relación calidad-experiencia.",
    tags: ["Familiar", "Aguas tranquilas", "Buen chiringuito"],
  },
];
