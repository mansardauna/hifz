import { SchoolCourse } from './types';

export const DEFAULT_SCHOOL_COURSES: SchoolCourse[] = [
  {
    id: 'course-vocational-solar',
    title: 'Solar Energy & Electrical Inverter Installation (Vocational Diploma)',
    category: 'vocational_trade',
    description: 'Hands-on practical training on photovoltaic panel mounting, battery bank wiring, charge controllers, and safety protocols.',
    thumbnail: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    instructorName: 'Eng. Usman Tariq (Master Electrician)',
    modules: [
      {
        id: 'mod-solar-1',
        title: 'Module 1: Safety Protocols & Circuit Foundations',
        description: 'Understand AC/DC power, multimeter measurements, and workshop safety PPE.',
        lessons: [
          {
            id: 'les-solar-101',
            title: '1. Workshop Safety & Tool Inspection',
            type: 'practical_workshop',
            durationMinutes: 45,
            content: `### Workshop Safety & Electrical Hazard Prevention
Before handling any DC battery bank or AC inverter terminal, verify all PPE equipment:
1. **Insulated Gloves**: Must be Class 0 (up to 1,000V rated).
2. **Eye Protection**: Impact-resistant polycarbonate goggles.
3. **Multimeter Calibration**: Verify CAT III/IV safety rating before probing live battery banks.`,
            practicalChecklist: [
              { id: 'step-1', stepNumber: 1, title: 'Inspect Multimeter Probes', description: 'Check probe insulation for cracks or exposed copper.', requiredProof: 'photo' },
              { id: 'step-2', stepNumber: 2, title: 'Verify Zero Energy State', description: 'Measure voltage across DC busbars before contact.', requiredProof: 'photo' },
              { id: 'step-3', stepNumber: 3, title: 'Grounding Verification', description: 'Verify copper grounding electrode connection.', requiredProof: 'text' },
            ],
            assessmentId: 'assess-quiz-1',
          },
          {
            id: 'les-solar-102',
            title: '2. PV Panel Series vs Parallel Calculations',
            type: 'lecture',
            durationMinutes: 30,
            content: `### Sizing PV Strings for MPPT Charge Controllers
- **Series Connection**: Voltages add up ($V_{total} = V_1 + V_2 + \dots$), current stays constant ($I_{total} = I_1$).
- **Parallel Connection**: Currents add up ($I_{total} = I_1 + I_2 + \dots$), voltage stays constant ($V_{total} = V_1$).
- **Maximum Open Circuit Voltage ($V_{oc}$)**: Must NEVER exceed the MPPT inverter's upper voltage limit at lowest ambient temperature.`,
            assessmentId: 'assess-practical-1',
          },
        ],
      },
    ],
    assessments: [
      {
        id: 'assess-quiz-1',
        title: 'Electrical Safety & Multimeter Knowledge Check',
        type: 'quiz',
        description: 'Test your understanding of DC safety, grounding, and meter probing.',
        timeLimitMinutes: 10,
        passingScorePercent: 75,
        questions: [
          {
            id: 'q-1',
            question: 'What is the primary danger when working on high-voltage DC battery strings compared to AC?',
            type: 'multiple_choice',
            options: [
              'DC current creates continuous sustained electric arcs that do not naturally cross zero',
              'DC is always safer than AC and has no electric shock hazard',
              'DC voltage drops to zero 60 times per second',
              'DC wiring cannot carry current through copper wires',
            ],
            correctAnswerIndex: 0,
            explanation: 'Unlike AC which passes through zero voltage 50/60 times per second, DC sustains electrical arcs continuously.',
            points: 25,
          },
          {
            id: 'q-2',
            question: 'When connecting two 24V 100Ah solar batteries in SERIES, what is the resulting output?',
            type: 'multiple_choice',
            options: [
              '48V and 100Ah',
              '24V and 200Ah',
              '48V and 200Ah',
              '12V and 50Ah',
            ],
            correctAnswerIndex: 0,
            explanation: 'In a series battery connection, voltages add together (24V + 24V = 48V) while amp-hour capacity remains constant (100Ah).',
            points: 25,
          },
          {
            id: 'q-3',
            question: 'True or False: You should always connect the battery bank to the hybrid inverter BEFORE turning on the solar array breakers.',
            type: 'true_false',
            options: ['True (Correct sequence)', 'False (Reverse sequence)'],
            correctAnswerIndex: 0,
            explanation: 'The hybrid inverter needs battery reference voltage to initialize its control board before accepting high PV array voltages.',
            points: 25,
          },
          {
            id: 'q-4',
            question: 'What gauge (AWG) copper wire is recommended for a 100A DC continuous current run under 2 meters?',
            type: 'multiple_choice',
            options: [
              '2 AWG (35mm²)',
              '14 AWG (2.5mm²)',
              '18 AWG (0.75mm²)',
              '22 AWG (0.35mm²)',
            ],
            correctAnswerIndex: 0,
            explanation: 'For a 100A DC circuit, 2 AWG (35mm²) prevents excessive voltage drop and fire hazard.',
            points: 25,
          },
        ],
      },
      {
        id: 'assess-practical-1',
        title: 'Practical Project: Inverter DC Wiring & Terminal Crimp Submission',
        type: 'practical_project',
        description: 'Submit high-resolution photographs and a video demonstration of your completed battery-to-inverter terminal crimping, heat-shrink tubing, and multimeter polarity check.',
        passingScorePercent: 80,
        practicalPrompt: `### Practical Assignment Instructions:
1. Strip 35mm² copper cable without damaging copper strands.
2. Hydraulic crimp the copper lug with the correct hexagonal die.
3. Apply adhesive dual-wall heat-shrink tubing over the barrel.
4. Measure voltage across positive and negative terminals with multimeter and record reading.
5. Upload clear photos and an explanation of your wiring gauge choice.`,
        acceptedFileTypes: ['image/*', 'video/*', 'application/pdf'],
        rubric: [
          { id: 'rub-1', name: 'Crimp Tightness & Mechanical Integrity', description: 'Lug is securely compressed with no loose strands', maxScore: 40, weightPercent: 40 },
          { id: 'rub-2', name: 'Heat Shrink Insulation & Safety', description: 'Proper sealing with no exposed bare copper', maxScore: 30, weightPercent: 30 },
          { id: 'rub-3', name: 'Polarity & Multimeter Verification', description: 'Correct color coding (Red/Black) and verified voltage', maxScore: 30, weightPercent: 30 },
        ],
      },
    ],
  },
];
