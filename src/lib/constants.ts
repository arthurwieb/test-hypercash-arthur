// src/lib/constants.ts
import { InputData } from '@/types'; // Importa a interface

interface TestCase {
  name: string;
  data: InputData;
  expected: 'RED' | 'YELLOW' | 'GREEN';
}

export const testCases: TestCase[] = [
  {
    name: "Caso Normal",
    data: {
      val: 1.0,
      flag1: false,
      text: "short",
      hour: 10,
      email: "user@example.com",
      addr1: "Street A",
      addr2: "Street A",
      count: 2,
      date: new Date("2025-07-10")
    },
    expected: "GREEN"
  },
  {
    name: "Caso Suspeito",
    data: {
      val: 2.0,
      flag1: false,
      text: "short",
      hour: 7,
      email: "user@gmail.com",
      addr1: "Street X",
      addr2: "Street X",
      count: 7,
      date: new Date("2025-06-01")
    },
    expected: "YELLOW"
  },
  {
    name: "Caso Crítico",
    data: {
      val: 3.0,
      flag1: true,
      text: "verylongtext",
      hour: 4,
      email: "hacker@temp.com",
      addr1: "Main St",
      addr2: "Side Ave",
      count: 10,
      date: new Date("2025-07-18")
    },
    expected: "RED"
  },
  {
    name: "Apenas Email Temp",
    data: {
      val: 0.5,
      flag1: false,
      text: "test",
      hour: 10,
      email: "test@temp.com",
      addr1: "Street A",
      addr2: "Street A",
      count: 2,
      date: new Date("2025-07-10")
    },
    expected: "GREEN"
  },
  {
    name: "Horário e Endereço",
    data: {
      val: 1.0,
      flag1: false,
      text: "short",
      hour: 7,
      email: "user@example.com",
      addr1: "Street A",
      addr2: "Street B",
      count: 2,
      date: new Date("2025-07-10")
    },
    expected: "YELLOW"
  }
];