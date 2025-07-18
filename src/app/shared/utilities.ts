import { v4 as uuidv4 } from 'uuid';
import { TodoModel } from '../models/todoModel';
import { format, addDays } from 'date-fns';

export function createExapmleTodos(): TodoModel[] {
  const now = new Date();

  return [
    {
      title: 'Berendelni a cementet',
      deadline: format(addDays(now, 5), 'yyyy-MM-dd'),
      isCompleted: false,
      category: {
        name: 'Munka',
        color: 'red',
      },
      id: uuidv4(),
    },
    {
      title: 'Peca makádon',
      deadline: format(addDays(now, 12), 'yyyy-MM-dd'),
      isCompleted: false,
      category: {
        name: 'Hobbi',
        color: 'green',
      },
      id: uuidv4(),
    },
    {
      title: 'Beszélni a könyvelővel',
      deadline: format(addDays(now, 2), 'yyyy-MM-dd'),
      isCompleted: true,
      id: uuidv4(),
      category: {
        name: 'Munka',
        color: 'red',
      },
    },
    {
      title: 'Kiporszívózni a kocsit',
      deadline: format(addDays(now, 2), 'yyyy-MM-dd'),
      isCompleted: false,
      id: uuidv4(),
      category: {
        name: '',
        color: '',
      },
    },
    {
      title: 'Kivinni a kukát',
      deadline: format(addDays(now, 2), 'yyyy-MM-dd'),
      isCompleted: true,
      id: uuidv4(),
      category: {
        name: '',
        color: '',
      },
    },
  ];
}
