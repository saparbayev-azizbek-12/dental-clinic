export interface Ticket {
  id: string;
  ticketNumber: string;
  doctorName: string;
  appointmentDate: string;
  waitingNumber: number;
  estimatedWaitTime: string;
  status: 'Kutilmoqda' | 'Jarayonda' | 'Bajarilgan' | 'Bekor qilingan';
}

export const mockTickets: Ticket[] = [
  {
    id: '1',
    ticketNumber: 'M21',
    doctorName: 'Dr. Aziza Karimova',
    appointmentDate: '2024-04-15',
    waitingNumber: 2,
    estimatedWaitTime: '2 soat',
    status: 'Kutilmoqda',
  },
  {
    id: '2',
    ticketNumber: 'M22',
    doctorName: 'Dr. Jamshid Rahimov',
    appointmentDate: '2024-04-15',
    waitingNumber: 1,
    estimatedWaitTime: '1 soat',
    status: 'Kutilmoqda',
  },
]; 