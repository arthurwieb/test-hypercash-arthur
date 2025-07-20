"use client"; // Marca este componente como um Client Component

import { Button, Group, NumberInput, Switch, Text, TextInput } from '@mantine/core'; // Importar componentes básicos do Mantine
import { DatePickerInput } from '@mantine/dates'; // Importar DatePickerInput
import { useForm, zodResolver } from '@mantine/form'; // Importar hooks do Mantine Form
import { useEffect, useState } from 'react';
import { z } from 'zod'; // Importar Zod

// Importar interfaces e schemas de arquivos separados
import { analyzeSomething } from '@/lib/analysisLogic'; // Assumindo que a função de análise está aqui
import { testCases } from '@/lib/constants'; // Assumindo que os casos de teste estão aqui
import { inputDataSchema } from '@/schemas/inputDataSchema'; // Assumindo que o schema Zod está aqui
import { AnalysisResult, InputData } from '@/types'; // Assumindo que suas interfaces estão aqui

// O tipo inferido do schema Zod para uso com useForm
type InputDataForm = z.infer<typeof inputDataSchema>;

const AnalysisApp = () => {
  // Configuração do formulário Mantine com Zod Resolver
  const form = useForm<InputDataForm>({
    initialValues: {
      val: 2.5,
      flag1: true,
      text: "short",
      hour: 3,
      email: "user@temp.com",
      addr1: "Street A",
      addr2: "Street B",
      count: 8,
      date: "2025-07-05", // Exemplo de data
    },
    validate: zodResolver(inputDataSchema),
  });

  // Estado para os resultados da análise
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({
    score: 0,
    level: '--',
    factors: [],
  });

  // Estado para o histórico de testes
  const [history, setHistory] = useState<InputData[]>(() => {
    try {
      const storedHistory = localStorage.getItem('analysisHistory');
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (e) {
      console.error("Falha ao carregar histórico do localStorage", e);
      return [];
    }
  });

  // Efeito para recalcular a análise sempre que os valores do formulário mudam (em tempo real)
  useEffect(() => {
    const currentValues = form.values;
    const validationResult = inputDataSchema.safeParse(currentValues);

    if (validationResult.success) {
      const result = analyzeSomething(validationResult.data);
      setAnalysisResult(result);
    } else {
      // Se houver erro de validação, podemos resetar ou mostrar um estado de "erro"
      setAnalysisResult({ score: 0, level: '--', factors: [] });
    }
  }, [form.values]); // Depende dos valores do formulário para atualização em tempo real

  // Efeito para salvar o histórico no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('analysisHistory', JSON.stringify(history));
    } catch (e) {
      console.error("Falha ao salvar histórico no localStorage", e);
    }
  }, [history]);

  // Handler para o botão "Analisar" (chamado apenas se o formulário for válido)
  const handleSubmit = (values: InputDataForm) => {
    const result = analyzeSomething(values);
    setAnalysisResult(result);
    // Adiciona ao histórico, limitando o tamanho para não sobrecarregar
    setHistory(prevHistory => {
      const newHistory = [values, ...prevHistory.slice(0, 4)]; // Mantém os últimos 5
      return newHistory;
    });
  };

  // Handler para carregar um caso de teste pré-definido
  const loadTestCase = (caseData: InputData) => {
    form.setValues(caseData); // Define os valores do formulário Mantine
  };

  // Handler para resetar o formulário
  const handleReset = () => {
    form.reset(); // Reseta o formulário para os initialValues
    setAnalysisResult({ score: 0, level: '--', factors: [] });
  };

  // Handler para copiar os dados de input
  const handleCopyData = () => {
    const dataToCopy = JSON.stringify(form.values, null, 2); // Copia os valores atuais do formulário
    document.execCommand('copy');
    alert('Dados copiados para a área de transferência!'); // Em produção, use um modal ou toast
  };

  // Função para obter a classe de cor do nível
  const getLevelColorClass = (level: AnalysisResult['level']) => {
    switch (level) {
      case 'GREEN': return 'bg-emerald-500 text-white';
      case 'YELLOW': return 'bg-amber-500 text-white';
      case 'RED': return 'bg-red-500 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  // Função para obter a descrição do fator para tooltips
  // const getFactorDescription = (factorName: string) => {
  //   switch (factorName) {
  //     case 'val': return 'Valor decimal para cálculo base (w1). Contribui com 0.2 por unidade.';
  //     case 'flag1': return 'Indica se a flag 1 está ativa (w2). Contribui com 10 pontos se ativa.';
  //     case 'text': return 'Comprimento do texto. Se maior que 4 caracteres (w3), contribui com 8 pontos.';
  //     case 'hour': return 'Hora do dia (0-23). Se fora do horário comercial (0-5h ou 24h), contribui com 15 pontos (w4).';
  //     case 'email': return 'Endereço de e-mail. Se contém "@temp" (w5), contribui com 12 pontos.';
  //     case 'addr1': return 'Primeiro endereço. Se diferente do segundo endereço (w6), contribui com 20 pontos.';
  //     case 'addr2': return 'Segundo endereço. Usado para comparação com o primeiro endereço.';
  //     case 'count': return 'Contador numérico. Se maior que 5 (w7), contribui com 9 pontos.';
  //     case 'date': return 'Data de referência (YYYY-MM-DD). Se for nos últimos 7 dias (w8), contribui com 14 pontos.';
  //     case 'F1': return 'Flag1 ativa: Contribui com 10 pontos.';
  //     case 'F2': return 'Texto longo (>4 caracteres): Contribui com 8 pontos.';
  //     case 'F3': return 'Horário noturno (0-5h ou 24h): Contribui com 15 pontos.';
  //     case 'F4': return 'Email temporário (@temp): Contribui com 12 pontos.';
  //     case 'F5': return 'Endereços diferentes: Contribui com 20 pontos.';
  //     case 'F6': return 'Contador alto (>5): Contribui com 9 pontos.';
  //     case 'F7': return 'Data recente (<7 dias): Contribui com 14 pontos.';
  //     default: return '';
  //   }
  // };

  // Função para renderizar as barras de breakdown (mantida aqui para acesso aos valores do form)
  const renderBreakdownBars = () => {
    const maxScore = 100;

    const breakdownValues = [
      { name: 'Valor base', value: form.values.val * 20, factor: 'w1' },
      { name: 'Flag 1 Ativa', value: form.values.flag1 ? 10 : 0, factor: 'w2' },
      { name: 'Texto Longo', value: form.values.text.length > 4 ? 8 : 0, factor: 'w3' },
      { name: 'Horário Noturno', value: (form.values.hour > 23 || form.values.hour < 6) ? 15 : 0, factor: 'w4' },
      { name: 'Email Temporário', value: form.values.email.includes('@temp') ? 12 : 0, factor: 'w5' },
      { name: 'Endereços Diferentes', value: form.values.addr1 !== form.values.addr2 ? 20 : 0, factor: 'w6' },
      { name: 'Contador Alto', value: form.values.count > 5 ? 9 : 0, factor: 'w7' },
      { name: 'Data Recente', value: (Date.now() - new Date(form.values.date).getTime()) / (1000 * 60 * 60 * 24) < 7 ? 14 : 0, factor: 'w8' },
    ];

    return breakdownValues.map((item, index) => {
      const widthPercentage = (item.value / maxScore) * 100;
      return (
        <div key={index} className="flex items-center gap-3 group relative">
          <span className="text-sm text-gray-300 w-48">{item.name}:</span>
          <div className="relative flex-grow bg-gray-700 rounded-full h-6 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${widthPercentage}%` }}
            ></div>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-100">
              {item.value}
            </span>
          </div>
          {/* Removido o tooltip customizado aqui */}
        </div>
      );
    });
  };


  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">

        {/* Formulário de Teste */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Análise de Algoritmo</h2>

          {/* Formulário Mantine com Grid */}
          <form onSubmit={form.onSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campo Valor (NumberInput) */}
            <NumberInput
              label="Valor:"
              placeholder="Ex: 2.5"
              min={0}
              step={0.1}
              className="w-full"
              description="Valor decimal para cálculo base."
              {...form.getInputProps('val')}
            />

            {/* Campo Flag1 (Switch) */}
            <Group justify="space-between" align="center" className="w-full">
              <Text className="text-sm font-semibold text-gray-300">Flag 1:</Text>
              <Switch
                label={form.values.flag1 ? 'Ativo' : 'Inativo'}
                description="Indica se a flag 1 está ativa." // Adicionado descrição aqui
                {...form.getInputProps('flag1', { type: 'checkbox' })}
              />
            </Group>

            {/* Campo Texto (TextInput) */}
            <TextInput
              label="Texto:"
              placeholder="Ex: short"
              className="w-full"
              description="String de texto."
              {...form.getInputProps('text')}
            />

            {/* Campo Hora (NumberInput) */}
            <NumberInput
              label="Hora:"
              placeholder="Ex: 3 (0-23)"
              min={0}
              max={23}
              className="w-full"
              description="Hora do dia (0-23)."
              {...form.getInputProps('hour')}
            />

            {/* Campo Email (TextInput) */}
            <TextInput
              label="Email:"
              placeholder="Ex: user@temp.com"
              type="email"
              className="w-full"
              description="Endereço de e-mail."
              {...form.getInputProps('email')}
            />

            {/* Campo Endereço 1 (TextInput) */}
            <TextInput
              label="Endereço 1:"
              placeholder="Ex: Street A"
              className="w-full"
              description="Primeiro endereço."
              {...form.getInputProps('addr1')}
            />

            {/* Campo Endereço 2 (TextInput) */}
            <TextInput
              label="Endereço 2:"
              placeholder="Ex: Street B"
              className="w-full"
              description="Segundo endereço."
              {...form.getInputProps('addr2')}
            />

            {/* Campo Contador (NumberInput) */}
            <NumberInput
              label="Contador:"
              placeholder="Ex: 8"
              min={0}
              className="w-full"
              description="Número inteiro."
              {...form.getInputProps('count')}
            />

            {/* Campo Data (DatePickerInput) */}
            <DatePickerInput
              label="Data:"
              placeholder="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
              className="w-full"
              description="Data no formato YYYY-MM-DD."
              {...form.getInputProps('date')}
              onChange={(value) => form.setFieldValue('date', value ? value.toString().split('T')[0] : '')}
              value={form.values.date ? new Date(form.values.date) : null}
            />

            <Button
              type="submit"
              className="w-full mt-6 py-3 px-6 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2 md:col-span-2" // Ocupa duas colunas
              // leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>}
            >
              Analisar
            </Button>
          </form>
        </div>

        {/* Visualização de Resultados */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Resultado da Análise</h2>

          <div id="results-display" className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-300">Score Final:</span>
              <span id="final-score" className="text-4xl font-extrabold text-blue-500">
                {analysisResult.score}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-300">Nível de Risco:</span>
              <span
                id="level-display"
                className={`px-4 py-2 rounded-full text-xl font-bold ${getLevelColorClass(analysisResult.level)}`}
              >
                {analysisResult.level}
              </span>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Detalhamento dos Fatores:</h3>
              <div id="factors-breakdown" className="space-y-3">
                {renderBreakdownBars()}
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Fatores Detectados:</h3>
              <div id="detected-factors-list" className="flex flex-wrap gap-2">
                {analysisResult.factors.length > 0 ? (
                  analysisResult.factors.map((factor, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                      {factor}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">Nenhum fator detectado.</span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <Button
                onClick={handleReset}
                className="py-2 px-4 bg-gray-700 text-gray-100 font-semibold rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Reiniciar Teste
              </Button>
              <Button
                onClick={handleCopyData}
                className="py-2 px-4 bg-gray-700 text-gray-100 font-semibold rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Copiar Dados
              </Button>
            </div>
          </div>
        </div>

        {/* Seção de Casos de Teste e Histórico */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mt-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Casos de Teste e Histórico</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Casos de Teste Pré-definidos */}
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Carregar Casos de Teste:</h3>
              <div id="predefined-tests" className="flex flex-wrap gap-3">
                {testCases.map((testCase, index) => (
                  <Button
                    key={index}
                    onClick={() => loadTestCase(testCase.data)}
                    className={`py-2 px-4 font-medium rounded-lg hover:opacity-80 transition duration-200 ${
                      getLevelColorClass(testCase.expected as AnalysisResult['level'])
                    }`}
                  >
                    {testCase.name} ({testCase.expected})
                  </Button>
                ))}
              </div>
            </div>

            {/* Histórico de Testes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Histórico de Testes:</h3>
              <ul id="history-list" className="space-y-2">
                {history.length > 0 ? (
                  history.map((item, index) => (
                    <li key={index} className="p-3 bg-gray-700 rounded-lg flex justify-between items-center border border-gray-600">
                      <span className="text-gray-200">
                        Score: {analyzeSomething(item).score}, Nível: {analyzeSomething(item).level}
                      </span>
                      <Button
                        onClick={() => form.setValues(item)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        Recarregar
                      </Button>
                    </li>
                  ))
                ) : (
                  <p id="no-history-message" className="text-gray-400 text-sm mt-2">Nenhum teste no histórico ainda.</p>
                )}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisApp;
