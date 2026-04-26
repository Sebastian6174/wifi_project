export const MOCK_TECHNICIANS = [
  {
    id: 'CT-042',
    name: 'Andrés Ramírez',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7SBreYcPMbrhDtfwY2MG64qn7cIC0H-5S-M-QBvqk8JuwLhS9dRcgBcP1cBFBSE0suQaPOxE8RWMiw_btL3zx53aYHuCaJBKfEgKQPBsPXRRye1R83gWTaDsPS6qdHTG-dcs01SqEZ5Rkwd2ZBLYz9sKo5zdX4BSboA2C7G02f-wBx9wP_TlkQ110VaKIgawS8cWqh-iDjL763jrzKhoxK-UpVCWOu8yDHrfntgd_LnJ1KbkFXO_3l0n4755LIL62uxSC-T6yfkg',
    zone: 'Cali Sur',
    skills: ['Fibra Óptica', 'Routers'],
    status: 'en_campo', // en_campo, activo, inactivo, descanso
    email: 'a.ramirez@calitech.com',
    phone: '+57 300 000 0001',
    shift: 'mañana'
  },
  {
    id: 'CT-089',
    name: 'María Gómez',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuwyRI3HeQWvu4_hhqjApdrmZv4kohSGdN6Zg5bapjuVWHEHlWowwtQVIY5rUxeds9fm4uz4vycvQodpihm6bqclerE0RmZ99qVjWKgxAiQ_bveBe9D7X1E_WxONtVzV02j3igHREPe68S5h8Zmd88oUYNmB7-jRtURLSE5JyO-7mMjYPjLw-FGGEQu1U0VBaHn7StdyckZRCkVBFG3cd12V8thfq6TKoSwYtuwWTxbnJG_2IORCUf5QfP2EdwqK3CPCbUOjfPM-c',
    zone: 'Cali Norte',
    skills: ['Microondas', 'Redes'],
    status: 'descanso',
    email: 'm.gomez@calitech.com',
    phone: '+57 300 000 0002',
    shift: 'tarde'
  },
  {
    id: 'CT-112',
    name: 'Javier Castillo',
    avatar: '',
    initials: 'JC',
    zone: 'Cali Oriente',
    skills: ['CCTV'],
    status: 'activo',
    email: 'j.castillo@calitech.com',
    phone: '+57 300 123 4567',
    shift: 'mañana'
  },
  {
    id: 'CT-015',
    name: 'Laura Salazar',
    initials: 'LS',
    zone: 'Cali Occidente',
    skills: ['Fibra Óptica', 'Soporte Nivel 2'],
    status: 'inactivo',
    email: 'l.salazar@calitech.com',
    phone: '+57 312 444 5555',
    shift: 'noche'
  }
];

export const STATUS_LABELS = {
  en_campo: { text: 'En Campo', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  activo:   { text: 'Activo', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  descanso: { text: 'Descanso', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  inactivo: { text: 'Inactivo', color: 'bg-slate-100 text-slate-800 border-slate-200' }
};
