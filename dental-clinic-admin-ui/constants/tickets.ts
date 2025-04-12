export interface Ticket {
  id: string;
  ticketNumber: string;
  doctorName: string;
  appointmentDate: string;
  waitingNumber: number;
  estimatedWaitTime: string;
  status: 'Kutilmoqda' | 'Tugallangan' | 'Bekor qilingan';
}

export const mockTickets: Ticket[] = [
  {
    id: '1',
    ticketNumber: 'M45',
    doctorName: 'Dr. Jamshid Rahimov',
    appointmentDate: '2024-03-20',
    waitingNumber: 1,
    estimatedWaitTime: '1 soat',
    status: 'Kutilmoqda'
  },
  {
    id: '2',
    ticketNumber: 'M67',
    doctorName: 'Dr. Sanjar Qosimov',
    appointmentDate: '2024-03-20',
    waitingNumber: 2,
    estimatedWaitTime: '2 soat',
    status: 'Kutilmoqda'
  },
  {
    id: '3',
    ticketNumber: 'M89',
    doctorName: 'Dr. Nodira Sharipova',
    appointmentDate: '2024-03-20',
    waitingNumber: 3,
    estimatedWaitTime: '3 soat',
    status: 'Kutilmoqda'
  }
]; 