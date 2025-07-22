// src/components/analysis/InputForm.tsx
"use client"; // Marca este componente como um Client Component

import { Button, Group, NumberInput, Switch, Text, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { UseFormReturnType } from '@mantine/form';
import { z } from 'zod';

import { inputDataSchema } from '@/schemas/inputDataSchema';

type InputDataForm = z.infer<typeof inputDataSchema>;

interface InputFormProps {
  form: UseFormReturnType<InputDataForm>;
  onSubmit: (values: InputDataForm) => void;
}

const InputForm = ({ form, onSubmit }: InputFormProps) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-700">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Análise de Algoritmo</h2>

      <form onSubmit={form.onSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campo Valor (NumberInput) */}
        <NumberInput
          label="Valor:"
          placeholder="Ex: 2.5"
          min={0}
          step={0.1}
          className="w-full"
          description="Valor decimal para cálculo base (w1). Contribui com 0.2 por unidade."
          {...form.getInputProps('val')}
        />

        {/* Campo Flag1 (Switch) */}
        <Group justify="space-between" align="center" className="w-full">
          <Text className="text-sm font-semibold text-gray-300">Flag 1:</Text>
          <Switch
            label={form.values.flag1 ? 'Ativo' : 'Inativo'}
            description="Indica se a flag 1 está ativa (w2). Contribui com 10 pontos se ativa."
            {...form.getInputProps('flag1', { type: 'checkbox' })}
          />
        </Group>

        {/* Campo Texto (TextInput) */}
        <TextInput
          label="Texto:"
          placeholder="Ex: short"
          className="w-full"
          description="Comprimento do texto. Se maior que 4 caracteres (w3), contribui com 8 pontos."
          value={form.values.text}
          {...form.getInputProps('text')}
        />

        {/* Campo Hora (NumberInput) */}
        <NumberInput
          label="Hora:"
          placeholder="Ex: 3 (0-23)"
          min={0}
          max={23}
          className="w-full"
          description="Hora do dia (0-23). Se fora do horário comercial (0-5h ou 24h), contribui com 15 pontos (w4)."
          {...form.getInputProps('hour')}
        />

        {/* Campo Email (TextInput) */}
        <TextInput
          label="Email:"
          placeholder="Ex: user@temp.com"
          type="email"
          className="w-full"
          description="Endereço de e-mail. Se contém '@temp' (w5), contribui com 12 pontos."
          {...form.getInputProps('email')}
        />

        {/* Campo Endereço 1 (TextInput) */}
        <TextInput
          label="Endereço 1:"
          placeholder="Ex: Street A"
          className="w-full"
          description="Primeiro endereço. Se diferente do segundo endereço (w6), contribui com 20 pontos."
          {...form.getInputProps('addr1')}
        />

        {/* Campo Endereço 2 (TextInput) */}
        <TextInput
          label="Endereço 2:"
          placeholder="Ex: Street B"
          className="w-full"
          description="Segundo endereço. Usado para comparação com o primeiro endereço."
          {...form.getInputProps('addr2')}
        />

        {/* Campo Contador (NumberInput) */}
        <NumberInput
          label="Contador:"
          placeholder="Ex: 8"
          min={0}
          className="w-full"
          description="Contador numérico. Se maior que 5 (w7), contribui com 9 pontos."
          {...form.getInputProps('count')}
        />

        {/* Campo Data (DatePickerInput) */}
        <DatePickerInput
          label="Data:"
          placeholder="Selecione a data"
          valueFormat="DD/MM/YYYY" // Formato de exibição
          className="w-full"
          description="Data de referência. Se for nos últimos 7 dias (w8), contribui com 14 pontos."
          {...form.getInputProps('date')}
        />

        <Button
          type="submit"
          className="w-full mt-6 py-3 px-6 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2 md:col-span-2"
          //leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>}
        >
          Analisar
        </Button>
      </form>
    </div>
  );
};

export default InputForm;
