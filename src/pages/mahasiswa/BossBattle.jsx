import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import HootieMascot from '../../components/mascot/HootieMascot';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const QUIZ_CATALOGUE = [
  // ===================== 1. DAILY ENGLISH QUIZ (10 min, Easy) → 10 soal =====================
  {
    id: 'daily', title: 'Daily English Quiz', subtitle: 'Latihan harian ringan untuk menjaga kebiasaan belajar bahasa Inggris',
    icon: 'today', color: 'from-emerald-500 to-teal-700', border: 'border-emerald-200', badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-800',
    tag: 'Semua Level', xpReward: 250, gemReward: 20, duration: '10 Menit', totalQ: 10, difficulty: 'Mudah', diffColor: 'text-emerald-600',
    questions_data: [
      { type: 'DAILY', question: 'Which sentence is grammatically correct?', options: ["She don't like coffee.", "She doesn't likes coffee.", "She doesn't like coffee.", "She not likes coffee."], answer: 2, explanation: 'Untuk subjek singular (she), gunakan "does not" + base form verb.' },
      { type: 'DAILY', question: 'Complete: "I _____ to the library yesterday."', options: ['go', 'goes', 'went', 'going'], answer: 2, explanation: '"Yesterday" menandakan past tense. Bentuk lampau dari "go" adalah "went".' },
      { type: 'DAILY', question: 'What is the plural form of "child"?', options: ['Childs', 'Childes', 'Children', 'Childrens'], answer: 2, explanation: '"Child" memiliki bentuk jamak tidak beraturan: "children".' },
      { type: 'DAILY', question: 'Choose the correct article: "He is _____ honest man."', options: ['a', 'an', 'the', 'no article needed'], answer: 1, explanation: 'Kata "honest" diawali dengan bunyi vokal /ɒ/, sehingga memakai artikel "an".' },
      { type: 'DAILY', question: 'Which word is a noun?', options: ['Run', 'Quickly', 'Happiness', 'Beautiful'], answer: 2, explanation: '"Happiness" adalah kata benda (noun) abstrak.' },
      { type: 'DAILY', question: 'Complete: "They _____ watching TV right now."', options: ['is', 'are', 'was', 'were'], answer: 1, explanation: '"They" adalah plural subject, sehingga menggunakan "are" untuk present continuous.' },
      { type: 'DAILY', question: 'What is the opposite of "expensive"?', options: ['Costly', 'Cheap', 'Pricey', 'Valuable'], answer: 1, explanation: 'Lawan kata dari "expensive" (mahal) adalah "cheap" (murah).' },
      { type: 'DAILY', question: 'Which is the correct past tense of "buy"?', options: ['Buyed', 'Buys', 'Bought', 'Buyed'], answer: 2, explanation: 'Bentuk lampau tidak beraturan dari "buy" adalah "bought".' },
      { type: 'DAILY', question: 'Identify the adjective: "The tall student answered correctly."', options: ['student', 'answered', 'tall', 'correctly'], answer: 2, explanation: '"Tall" adalah kata sifat (adjective) yang menerangkan kata benda "student".' },
      { type: 'DAILY', question: 'Choose the correct preposition: "She is good _____ mathematics."', options: ['in', 'on', 'at', 'for'], answer: 2, explanation: 'Frasa idiomatis yang benar adalah "good at" untuk menyatakan kemampuan seseorang.' },
    ],
  },
  // ===================== 2. WORD FORMATION (15 min, Easy) → 10 soal =====================
  {
    id: 'word_formation', title: 'Word Formation', subtitle: 'Pelajari pembentukan kata dari root, prefix, suffix dalam bahasa Inggris',
    icon: 'text_fields', color: 'from-orange-500 to-amber-700', border: 'border-orange-200', badgeBg: 'bg-orange-100', badgeText: 'text-orange-800',
    tag: 'Dasar - Menengah', xpReward: 300, gemReward: 22, duration: '15 Menit', totalQ: 10, difficulty: 'Mudah', diffColor: 'text-orange-600',
    questions_data: [
      { type: 'WORD_FORM', question: 'What is the noun form of the verb "communicate"?', options: ['Communicative', 'Communicator', 'Communication', 'Communicating'], answer: 2, explanation: 'Suffix "-tion" mengubah verb menjadi noun: communicate → communication.' },
      { type: 'WORD_FORM', question: 'The prefix "mis-" means:', options: ['Again', 'Before', 'Wrongly', 'Against'], answer: 2, explanation: '"Mis-" berarti "keliru/salah", contoh: misunderstand, miscommunicate.' },
      { type: 'WORD_FORM', question: 'What is the adjective form of "academy"?', options: ['Academically', 'Academic', 'Academician', 'Academize'], answer: 1, explanation: 'Kata sifat dari "academy" adalah "academic".' },
      { type: 'WORD_FORM', question: 'Which suffix turns an adjective into a noun?', options: ['-ly', '-ful', '-ness', '-ize'], answer: 2, explanation: 'Suffix "-ness" mengubah adjective menjadi noun, contoh: happy → happiness.' },
      { type: 'WORD_FORM', question: 'The word "international" contains which prefix meaning "between"?', options: ['inter-', 'intra-', 'trans-', 'multi-'], answer: 0, explanation: '"Inter-" berarti "antar/diantara", contoh: international, interact.' },
      { type: 'WORD_FORM', question: 'What does the suffix "-ful" mean?', options: ['Without', 'Full of', 'Against', 'Before'], answer: 1, explanation: '"-ful" berarti "penuh dengan", contoh: beautiful, grateful, powerful.' },
      { type: 'WORD_FORM', question: 'Form an adverb from the adjective "careful":', options: ['Carefulness', 'Carefully', 'Carefy', 'Carefull'], answer: 1, explanation: 'Adverb dibentuk dari adjective dengan menambahkan suffix "-ly": careful → carefully.' },
      { type: 'WORD_FORM', question: 'The prefix "pre-" means:', options: ['After', 'During', 'Before', 'Against'], answer: 2, explanation: '"Pre-" berarti "sebelum", contoh: preview, prehistoric, predict.' },
      { type: 'WORD_FORM', question: 'What is the verb form of the noun "solution"?', options: ['Solutionize', 'Solve', 'Solutionary', 'Solving'], answer: 1, explanation: 'Bentuk verb dari noun "solution" adalah "solve".' },
      { type: 'WORD_FORM', question: 'Which word uses the prefix "un-" correctly?', options: ['Unlogical', 'Unhappy', 'Unrespect', 'Unexplicit'], answer: 1, explanation: '"Unhappy" adalah penggunaan prefix "un-" yang tepat. Kata "illogical", "disrespect", dan "implicit" adalah bentuk yang benar untuk yang lain.' },
    ],
  },
  // ===================== 3. VOCABULARY CHALLENGE (20 min, Menengah) → 15 soal =====================
  {
    id: 'vocabulary', title: 'Vocabulary Challenge', subtitle: 'Kuasai kosakata bahasa Inggris dari level dasar hingga akademik',
    icon: 'menu_book', color: 'from-violet-500 to-purple-700', border: 'border-violet-200', badgeBg: 'bg-violet-100', badgeText: 'text-violet-800',
    tag: 'Dasar - Menengah', xpReward: 400, gemReward: 25, duration: '20 Menit', totalQ: 15, difficulty: 'Menengah', diffColor: 'text-violet-600',
    questions_data: [
      { type: 'VOCABULARY', question: 'Choose the correct synonym of "benevolent".', options: ['Malicious', 'Kindhearted', 'Ignorant', 'Boisterous'], answer: 1, explanation: '"Benevolent" berarti dermawan dan baik hati, sinonimnya "kindhearted".' },
      { type: 'VOCABULARY', question: 'The word "ubiquitous" most nearly means:', options: ['Rare and precious', 'Found everywhere', 'Extremely ancient', 'Highly complicated'], answer: 1, explanation: '"Ubiquitous" artinya ada di mana-mana.' },
      { type: 'VOCABULARY', question: 'Select the antonym of "affluent".', options: ['Wealthy', 'Prominent', 'Impoverished', 'Generous'], answer: 2, explanation: '"Affluent" berarti kaya. Antonimnya adalah "impoverished" (miskin).' },
      { type: 'VOCABULARY', question: 'What is the closest meaning of "meticulous"?', options: ['Careless', 'Vague', 'Detailed and precise', 'Rapid'], answer: 2, explanation: '"Meticulous" berarti sangat teliti dan memperhatikan detail.' },
      { type: 'VOCABULARY', question: 'Identify the synonym for "ephemeral".', options: ['Permanent', 'Short-lived', 'Brilliant', 'Dull'], answer: 1, explanation: '"Ephemeral" berarti tidak kekal atau berumur pendek.' },
      { type: 'VOCABULARY', question: 'The word "ambiguous" means:', options: ['Clearly defined', 'Open to more than one interpretation', 'Widely known', 'Strongly opposed'], answer: 1, explanation: '"Ambiguous" berarti dapat diartikan lebih dari satu cara, atau tidak jelas.' },
      { type: 'VOCABULARY', question: 'Choose the word closest in meaning to "candid":', options: ['Secretive', 'Brutal', 'Frank and honest', 'Fearful'], answer: 2, explanation: '"Candid" berarti berbicara jujur dan terbuka tanpa basa-basi.' },
      { type: 'VOCABULARY', question: '"Pragmatic" is best described as:', options: ['Idealistic', 'Theoretical', 'Practical and realistic', 'Emotional'], answer: 2, explanation: '"Pragmatic" berarti bersikap praktis dan realistis, bukan idealis.' },
      { type: 'VOCABULARY', question: 'The antonym of "verbose" is:', options: ['Talkative', 'Concise', 'Repetitive', 'Elaborate'], answer: 1, explanation: '"Verbose" berarti terlalu banyak bicara. Antonimnya adalah "concise" (ringkas).' },
      { type: 'VOCABULARY', question: 'What does "diligent" mean?', options: ['Lazy', 'Hardworking', 'Stubborn', 'Confused'], answer: 1, explanation: '"Diligent" berarti rajin dan tekun dalam melakukan sesuatu.' },
      { type: 'VOCABULARY', question: '"Profound" most nearly means:', options: ['Shallow', 'Ordinary', 'Deep and meaningful', 'Temporary'], answer: 2, explanation: '"Profound" berarti mendalam, baik secara literal maupun metaforis (pengetahuan, perasaan).' },
      { type: 'VOCABULARY', question: 'Choose the synonym for "obsolete":', options: ['Modern', 'Outdated', 'Efficient', 'New'], answer: 1, explanation: '"Obsolete" berarti sudah tidak terpakai lagi atau usang.' },
      { type: 'VOCABULARY', question: 'The word "tenacious" means:', options: ['Flexible', 'Persistent', 'Careless', 'Fragile'], answer: 1, explanation: '"Tenacious" berarti gigih, tidak mudah menyerah.' },
      { type: 'VOCABULARY', question: 'What is the meaning of "scrutinize"?', options: ['To ignore', 'To examine very carefully', 'To summarize', 'To approve'], answer: 1, explanation: '"Scrutinize" berarti memeriksa atau mengamati sesuatu secara sangat teliti.' },
      { type: 'VOCABULARY', question: '"Eloquent" describes someone who is:', options: ['Shy', 'Rude', 'Skilled in clear and effective speaking', 'Confused'], answer: 2, explanation: '"Eloquent" berarti fasih dan efektif dalam berbicara atau menulis.' },
    ],
  },
  // ===================== 4. CONVERSATION CHALLENGE (15 min, Menengah) → 15 soal =====================
  {
    id: 'conversation', title: 'Conversation Challenge', subtitle: 'Simulasi percakapan bahasa Inggris dalam konteks akademik dan sosial',
    icon: 'forum', color: 'from-indigo-500 to-blue-700', border: 'border-indigo-200', badgeBg: 'bg-indigo-100', badgeText: 'text-indigo-800',
    tag: 'Dasar - Menengah', xpReward: 350, gemReward: 25, duration: '15 Menit', totalQ: 15, difficulty: 'Menengah', diffColor: 'text-indigo-600',
    questions_data: [
      { type: 'CONVERSATION', question: 'A: "Could you please explain the assignment deadline?" B: "_____"', options: ['"Yes, I can explain."', '"Sure! The deadline is next Friday at midnight."', '"I do not know when."', '"The deadline is very important."'], answer: 1, explanation: 'Respons terbaik adalah yang informatif dan langsung menjawab pertanyaan.' },
      { type: 'CONVERSATION', question: 'Which is the most polite way to ask for help in an academic setting?', options: ['"Give me the notes."', '"Hey, notes please."', '"Would you mind sharing your notes with me?"', '"I need your notes now."'], answer: 2, explanation: '"Would you mind...?" adalah ekspresi sopan untuk meminta bantuan.' },
      { type: 'CONVERSATION', question: 'Professor: "Do you have any questions about the lecture?" Best student response:', options: ['"No."', '"Yes, could you elaborate on the third point?"', '"I have many questions."', '"The lecture was boring."'], answer: 1, explanation: 'Respons akademik yang baik harus spesifik dan sopan.' },
      { type: 'CONVERSATION', question: 'A: "I am having trouble with my code." B: "_____"', options: ['"Good luck."', '"Do you want me to take a look?"', '"Why are you bad at coding?"', '"I do not care."'], answer: 1, explanation: 'Menawarkan bantuan dengan pertanyaan adalah cara yang suportif.' },
      { type: 'CONVERSATION', question: 'In a meeting, how do you politely disagree?', options: ['"You are wrong."', '"I completely disagree."', '"I see your point, but I have a different perspective."', '"That is a terrible idea."'], answer: 2, explanation: 'Mengakui pendapat lawan bicara sebelum memberikan opini berbeda adalah cara paling sopan.' },
      { type: 'CONVERSATION', question: 'A: "Shall we reschedule the meeting?" Best response showing flexibility:', options: ['"No, let\'s keep it."', '"Sure, what time works best for you?"', '"It\'s up to you."', '"I don\'t mind either way."'], answer: 1, explanation: 'Bertanya tentang waktu yang cocok menunjukkan fleksibilitas dan sikap kooperatif.' },
      { type: 'CONVERSATION', question: 'How do you appropriately interrupt someone in a formal meeting?', options: ['"Stop talking!"', '"Hey!"', '"Sorry to interrupt, but I have a quick point."', '"Let me speak now."'], answer: 2, explanation: 'Menggunakan "Sorry to interrupt" menunjukkan kesopanan sebelum menyela pembicaraan.' },
      { type: 'CONVERSATION', question: '"I\'m not sure I follow." What does this phrase mean?', options: ['I do not agree', 'I do not understand', 'I am not here', 'I cannot walk'], answer: 1, explanation: '"I don\'t follow" adalah ungkapan informal untuk menyatakan bahwa Anda tidak mengerti.' },
      { type: 'CONVERSATION', question: 'Best way to start a formal email to a professor you have not met:', options: ['"Hey Professor!"', '"Yo, prof!"', '"Dear Professor [Name],"', '"Hi there,"'], answer: 2, explanation: '"Dear Professor [Name]," adalah salam pembuka paling formal dan tepat.' },
      { type: 'CONVERSATION', question: 'A: "Can I ask you something?" B: "_____"', options: ['"No."', '"Sure, go ahead."', '"Maybe."', '"What do you want?"'], answer: 1, explanation: '"Sure, go ahead" adalah cara ramah dan terbuka untuk mengundang seseorang berbicara.' },
      { type: 'CONVERSATION', question: 'To show you are listening and engaged in a conversation, you say:', options: ['"Whatever."', '"I see," or "That makes sense."', '"Okay, I got it."', '"Yeah, yeah."'], answer: 1, explanation: 'Backchanneling seperti "I see" atau "That makes sense" menunjukkan Anda aktif mendengarkan.' },
      { type: 'CONVERSATION', question: 'How do you ask someone to repeat something politely?', options: ['"What?!"', '"Speak louder!"', '"I beg your pardon? Could you say that again?"', '"Repeat that."'], answer: 2, explanation: '"I beg your pardon?" adalah cara sangat sopan meminta seseorang mengulang ucapannya.' },
      { type: 'CONVERSATION', question: 'A classmate looks stressed. Which is the most empathetic response?', options: ['"It\'s not that bad."', '"Just relax."', '"It looks like you\'re having a tough time. Is there anything I can do?"', '"Everyone has problems."'], answer: 2, explanation: 'Empati diekspresikan dengan mengakui perasaan orang lain dan menawarkan bantuan secara tulus.' },
      { type: 'CONVERSATION', question: 'Which phrase is used to summarize what someone said?', options: ['"In other words..."', '"Therefore..."', '"However..."', '"For example..."'], answer: 0, explanation: '"In other words" digunakan untuk merangkum atau memperjelas kembali apa yang sudah dikatakan.' },
      { type: 'CONVERSATION', question: 'Which is the most appropriate closing for a formal presentation?', options: ['"That\'s all, bye!"', '"Thank you for your attention. I\'m happy to take any questions."', '"Okay, I\'m done."', '"So yeah, that\'s it."'], answer: 1, explanation: 'Penutup presentasi formal yang baik berisi ucapan terima kasih dan undangan sesi tanya jawab.' },
    ],
  },
  // ===================== 5. LISTENING COMPREHENSION (20 min, Menengah) → 15 soal =====================
  {
    id: 'listening', title: 'Listening Comprehension', subtitle: 'Uji pemahaman mendengarkan dan interpretasi konteks percakapan lisan',
    icon: 'headphones', color: 'from-teal-500 to-cyan-700', border: 'border-teal-200', badgeBg: 'bg-teal-100', badgeText: 'text-teal-800',
    tag: 'Menengah - Mahir', xpReward: 420, gemReward: 30, duration: '20 Menit', totalQ: 15, difficulty: 'Menengah', diffColor: 'text-teal-600',
    questions_data: [
      { type: 'LISTENING', question: 'You hear: "The seminar has been rescheduled to Thursday." What does this mean?', options: ['The seminar is cancelled', 'The seminar now takes place on Thursday', 'The seminar was already on Thursday', 'The speaker is unsure'], answer: 1, explanation: '"Rescheduled to Thursday" means the event was moved to Thursday.' },
      { type: 'LISTENING', question: 'Speaker says: "I can\'t say I agree with that approach." What is the speaker doing?', options: ['Agreeing enthusiastically', 'Expressing partial disagreement', 'Asking for clarification', 'Making a suggestion'], answer: 1, explanation: '"I can\'t say I agree" is a polite way of expressing disagreement.' },
      { type: 'LISTENING', question: 'You hear: "Could you spare a moment?" What is the speaker asking?', options: ['If you have a spare pen', 'If you have a moment to talk', 'If you can spare some money', 'If you can spare a seat'], answer: 1, explanation: '"Spare a moment" means to have a brief time available to talk.' },
      { type: 'LISTENING', question: '"The results were, to say the least, disappointing." What does the speaker imply?', options: ['The results were excellent', 'The results were as expected', 'The results were very disappointing', 'The results were surprising'], answer: 2, explanation: '"To say the least" is an understatement emphasizing how disappointing the results were.' },
      { type: 'LISTENING', question: 'A: "Did you manage to finish the report?" B: "I\'m afraid not." What does B mean?', options: ['B is afraid of something', 'B finished the report', 'B did not finish the report', 'B is asking for help'], answer: 2, explanation: '"I\'m afraid not" is a polite way of saying "No, I did not."' },
      { type: 'LISTENING', question: 'A professor says: "This will be on the exam." What should a student do?', options: ['Ignore it', 'Write it down and study it', 'Ask classmates', 'Look it up later'], answer: 1, explanation: 'When a professor signals something is important for an exam, students should note and study it.' },
      { type: 'LISTENING', question: '"Bear in mind that the deadline is strict." What does "bear in mind" mean?', options: ['Forget about it', 'Remember', 'Write it down', 'Discuss it'], answer: 1, explanation: '"Bear in mind" means to remember or keep something in your thoughts.' },
      { type: 'LISTENING', question: 'A: "I\'m swamped with work right now." What does "swamped" mean here?', options: ['In a swamp', 'Very busy', 'Very tired', 'Very confused'], answer: 1, explanation: '"Swamped" (informal) means overwhelmed with too much work or tasks.' },
      { type: 'LISTENING', question: '"Let\'s call it a day." What does this expression mean?', options: ['Let\'s call someone', 'Let\'s stop working for today', 'Let\'s plan the day', 'Let\'s name the project'], answer: 1, explanation: '"Call it a day" means to stop working and end the session for the day.' },
      { type: 'LISTENING', question: 'Speaker: "The figures don\'t add up." What does the speaker mean?', options: ['The numbers are too big', 'The numbers are correct', 'The numbers do not make sense', 'The numbers are missing'], answer: 2, explanation: '"Don\'t add up" means the calculations or information are inconsistent or don\'t make sense.' },
      { type: 'LISTENING', question: '"I\'ll keep you posted." What is the speaker promising?', options: ['To write a letter', 'To update you with information', 'To post on social media', 'To ask for your help'], answer: 1, explanation: '"Keep you posted" means to regularly update someone with new information.' },
      { type: 'LISTENING', question: '"She spoke off the top of her head." What does this mean?', options: ['She rehearsed her speech', 'She spoke without preparation', 'She spoke very quickly', 'She spoke from notes'], answer: 1, explanation: '"Off the top of one\'s head" means speaking spontaneously without prior preparation.' },
      { type: 'LISTENING', question: 'A: "Could you run me through the steps?" What is A asking?', options: ['A wants to go for a run', 'A wants a detailed explanation of the steps', 'A wants to count the steps', 'A wants to skip the steps'], answer: 1, explanation: '"Run me through" means to explain or guide someone through something step by step.' },
      { type: 'LISTENING', question: '"The presentation went over well." What does this mean?', options: ['The presentation ran too long', 'The presentation was well-received', 'The presentation was cancelled', 'The presentation went too fast'], answer: 1, explanation: '"Went over well" means the audience responded positively.' },
      { type: 'LISTENING', question: '"We need to get the ball rolling." What does this phrase suggest?', options: ['We need to stop the project', 'We need to find a ball', 'We need to start taking action', 'We need to slow down'], answer: 2, explanation: '"Get the ball rolling" means to begin an activity or get things started.' },
    ],
  },
  // ===================== 6. GRAMMAR CHALLENGE (25 min, Sulit) → 20 soal =====================
  {
    id: 'grammar', title: 'Grammar Challenge', subtitle: 'Uji pemahaman tata bahasa Inggris: tense, structure, dan kaidah',
    icon: 'spellcheck', color: 'from-rose-500 to-pink-700', border: 'border-rose-200', badgeBg: 'bg-rose-100', badgeText: 'text-rose-800',
    tag: 'Menengah - Mahir', xpReward: 500, gemReward: 35, duration: '25 Menit', totalQ: 20, difficulty: 'Sulit', diffColor: 'text-rose-600',
    questions_data: [
      { type: 'STRUCTURE', question: 'Not only _____ the research findings, but she also presented a compelling alternative model.', options: ['she challenged', 'did she challenge', 'she was challenging', 'had she challenged'], answer: 1, explanation: 'Negative inversion: "Not only" di awal kalimat membalik urutan auxiliary + subject.' },
      { type: 'STRUCTURE', question: 'By the time the professor arrived, the students _____ for over an hour.', options: ['waited', 'have waited', 'had been waiting', 'were waiting'], answer: 2, explanation: 'Past Perfect Continuous untuk aksi yang berlangsung hingga titik waktu tertentu di masa lampau.' },
      { type: 'STRUCTURE', question: 'Neither the students nor the teacher _____ aware of the schedule change.', options: ['were', 'was', 'are', 'have been'], answer: 1, explanation: 'Dengan "neither...nor", verb mengikuti subjek yang paling dekat (teacher = singular).' },
      { type: 'STRUCTURE', question: 'Had I known about the issue, I _____ you immediately.', options: ['would tell', 'will tell', 'would have told', 'had told'], answer: 2, explanation: 'Third Conditional Inversion: "Had I known... would have told".' },
      { type: 'STRUCTURE', question: 'It is essential that the manager _____ the report by Friday.', options: ['finishes', 'finish', 'finished', 'will finish'], answer: 1, explanation: 'Subjunctive mood setelah "essential that" memerlukan base form verb.' },
      { type: 'STRUCTURE', question: 'The committee _____ on the proposal for three days before reaching a decision.', options: ['deliberated', 'has deliberated', 'had deliberated', 'deliberates'], answer: 2, explanation: 'Past Perfect digunakan untuk aksi yang selesai sebelum aksi lain di masa lampau.' },
      { type: 'STRUCTURE', question: 'Scarcely _____ sat down when the meeting began.', options: ['had he', 'he had', 'did he', 'he was'], answer: 0, explanation: '"Scarcely" memicu inversion: Scarcely + had + subject + V3.' },
      { type: 'STRUCTURE', question: 'The findings suggest that economic growth _____ social inequality in developing nations.', options: ['exacerbates', 'exacerbate', 'exacerbated', 'exacerbating'], answer: 0, explanation: '"Suggest that" + present tense dalam academic writing untuk menyatakan kebenaran umum.' },
      { type: 'STRUCTURE', question: 'Only after extensive testing _____ approved for commercial use.', options: ['was the device', 'the device was', 'the device is', 'is the device'], answer: 0, explanation: '"Only after" di awal kalimat memerlukan inversion: auxiliary + subject.' },
      { type: 'STRUCTURE', question: 'The report, together with all supporting documents, _____ submitted on time.', options: ['were', 'was', 'are', 'have been'], answer: 1, explanation: '"Together with" tidak mengubah subjek utama "the report" (singular), sehingga verb-nya singular.' },
      { type: 'STRUCTURE', question: '"Were the experiment to be repeated, the results _____ likely differ." What tense is this?', options: ['Third Conditional', 'Second Conditional', 'Inverted Second Conditional', 'Future Perfect'], answer: 2, explanation: '"Were [subject] to be..." adalah bentuk inversi dari Second Conditional.' },
      { type: 'STRUCTURE', question: 'Choose the correct relative clause: "The researcher _____ paper was published is speaking now."', options: ['which', 'who', 'whose', 'whom'], answer: 2, explanation: '"Whose" digunakan untuk menunjukkan kepemilikan dalam relative clause.' },
      { type: 'STRUCTURE', question: 'The data _____ been analyzed using a statistical software package.', options: ['has', 'have', 'had', 'having'], answer: 1, explanation: '"Data" diperlakukan sebagai plural noun dalam academic writing: "data have".' },
      { type: 'STRUCTURE', question: 'What is the error? "The professor gave each of the student a handout."', options: ['"gave"', '"each of"', '"the student"', '"a handout"'], answer: 2, explanation: 'Setelah "each of the", noun harus plural: "the students".' },
      { type: 'STRUCTURE', question: 'Choose the correct sentence:', options: ['If I would have time, I would help.', 'If I had time, I would help.', 'If I have had time, I would help.', 'If I had had time, I would help.'], answer: 1, explanation: 'Second Conditional: "If + past simple, would + V1". Pilihan D adalah Third Conditional.' },
      { type: 'STRUCTURE', question: '"The students, as well as the lecturer, _____ going to attend the symposium."', options: ['is', 'are', 'were', 'was'], answer: 0, explanation: '"As well as" tidak mengubah subjek utama "the students"... wait, "the students" adalah plural, so seharusnya "are". Jawaban: "are".', explanation: '"The students" adalah plural subject. "As well as the lecturer" adalah tambahan, sehingga verb harus plural: "are".' },
      { type: 'STRUCTURE', question: '"The students, as well as the lecturer, _____ going to attend the symposium."', options: ['is', 'are', 'were', 'was'], answer: 1, explanation: '"The students" adalah plural subject. "As well as" tidak mempengaruhi subjek, sehingga verb harus plural: "are".' },
      { type: 'STRUCTURE', question: 'Identify the dangling modifier: "_____"', options: ['"Walking to school, the rain started."', '"Walking to school, she got caught in the rain."', '"She walked to school, and it rained."', '"While walking, she noticed the rain."'], answer: 0, explanation: '"Walking to school, the rain started" adalah dangling modifier — subjek "the rain" tidak bisa berjalan.' },
      { type: 'STRUCTURE', question: 'Which sentence uses the passive voice correctly?', options: ['The paper was written by the team of researchers.', 'The team was written the paper.', 'Written was the paper by the team.', 'The paper written by the team was.'], answer: 0, explanation: 'Passive voice: Subject + to be + V3 + by + agent.' },
      { type: 'STRUCTURE', question: 'Choose the sentence with a misplaced modifier:', options: ['"She almost drove her children to school every day."', '"She drove her children to school almost every day."', '"Almost every day, she drove her children to school."', '"Her children were driven to school almost every day."'], answer: 0, explanation: '"Almost" seharusnya memodifikasi "every day", bukan "drove". Posisi yang benar ada di pilihan B atau C.' },
    ],
  },
  // ===================== 7. READING CHALLENGE (30 min, Sulit) → 20 soal =====================
  {
    id: 'reading', title: 'Reading Challenge', subtitle: 'Latih kemampuan membaca dan memahami teks bahasa Inggris akademik',
    icon: 'chrome_reader_mode', color: 'from-sky-500 to-blue-700', border: 'border-sky-200', badgeBg: 'bg-sky-100', badgeText: 'text-sky-800',
    tag: 'Menengah Atas - Mahir', xpReward: 450, gemReward: 30, duration: '30 Menit', totalQ: 20, difficulty: 'Sulit', diffColor: 'text-sky-600',
    questions_data: [
      { type: 'READING', question: 'Photosynthesis converts light energy into chemical energy stored in glucose. What is the main product?', options: ['Light energy', 'Oxygen', 'Glucose', 'Carbon dioxide'], answer: 2, explanation: 'Teks menyebutkan bahwa energi kimia disimpan dalam glukosa.' },
      { type: 'READING', question: 'The word "converts" is closest in meaning to:', options: ['Destroys', 'Transforms', 'Produces', 'Absorbs'], answer: 1, explanation: '"Converts" berarti mengubah dari satu bentuk ke bentuk lain.' },
      { type: 'READING', question: 'Which inference can be drawn? "Photosynthesis converts light into chemical energy stored in glucose."', options: ['It requires no sunlight', 'It occurs only in animals', 'It is a process that stores energy', 'It releases energy as heat'], answer: 2, explanation: '"Chemical energy stored" mengindikasikan fotosintesis menyimpan energi.' },
      { type: 'READING', question: '"The groundbreaking research radically challenged the status quo." What is the tone?', options: ['Critical', 'Humorous', 'Objective', 'Enthusiastic'], answer: 3, explanation: '"Groundbreaking" dan "radically" menunjukkan nada yang antusias terhadap perubahan.' },
      { type: 'READING', question: 'The pronoun "it" in "It stores energy as glucose" refers to:', options: ['The theory', 'Photosynthesis', 'The microscope', 'The result'], answer: 1, explanation: 'Berdasarkan konteks, "it" merujuk pada subjek utama yang dibahas, yaitu fotosintesis.' },
      { type: 'READING', question: 'Passage: "Despite early setbacks, the team persevered and ultimately succeeded." What does "persevered" mean?', options: ['Gave up', 'Complained', 'Continued with determination', 'Asked for help'], answer: 2, explanation: '"Persevered" berarti terus berjuang dengan tekad meskipun menghadapi kesulitan.' },
      { type: 'READING', question: '"The author implies..." What reading skill is being tested?', options: ['Skimming', 'Inference', 'Scanning', 'Summarizing'], answer: 1, explanation: 'Soal tentang apa yang "implied" menguji kemampuan inferensi (menarik kesimpulan tersirat).' },
      { type: 'READING', question: 'Passage: "Studies confirm that regular exercise reduces cognitive decline." Which statement is best supported?', options: ['Exercise cures all diseases', 'Exercise has some benefit for brain health', 'Exercise is more effective than medicine', 'Exercise is required for academic success'], answer: 1, explanation: 'Hanya pernyataan B yang didukung langsung oleh teks tanpa over-generalisasi.' },
      { type: 'READING', question: '"The findings are inconclusive." What does "inconclusive" mean?', options: ['Very clear', 'Not leading to a definite answer', 'Surprising', 'Positive'], answer: 1, explanation: '"Inconclusive" berarti tidak menghasilkan kesimpulan yang jelas atau pasti.' },
      { type: 'READING', question: '"Contrary to popular belief, bats are not blind." What is the function of "contrary to"?', options: ['To agree with a common view', 'To introduce a contrasting fact', 'To give an example', 'To conclude an argument'], answer: 1, explanation: '"Contrary to" digunakan untuk memperkenalkan fakta yang bertentangan dengan asumsi umum.' },
      { type: 'READING', question: 'A passage title is "The Hidden Costs of Urbanization." What is the main topic?', options: ['Tourism in cities', 'Negative effects of city growth', 'Urban planning solutions', 'Population growth rates'], answer: 1, explanation: '"Hidden costs" merujuk pada dampak negatif yang tidak langsung terlihat dari urbanisasi.' },
      { type: 'READING', question: '"The study was conducted over a period of five years, involving 2,000 participants." This sentence provides:', options: ['The conclusion', 'The opinion of the author', 'Methodological details', 'Recommendations'], answer: 2, explanation: 'Informasi tentang durasi dan jumlah peserta merupakan detail metodologi penelitian.' },
      { type: 'READING', question: '"While the hypothesis was plausible, it lacked empirical support." "Plausible" means:', options: ['Impossible', 'Reasonably believable', 'Scientifically proven', 'Widely accepted'], answer: 1, explanation: '"Plausible" berarti masuk akal atau dapat dipercaya meskipun belum terbukti.' },
      { type: 'READING', question: 'Which word signals a contrast in academic writing?', options: ['Furthermore', 'Similarly', 'Nevertheless', 'In addition'], answer: 2, explanation: '"Nevertheless" (dan "however", "although") digunakan untuk menandai kontras atau pertentangan.' },
      { type: 'READING', question: '"The data unequivocally support the hypothesis." "Unequivocally" means:', options: ['Partially', 'Without any doubt', 'Surprisingly', 'Temporarily'], answer: 1, explanation: '"Unequivocally" berarti tanpa keraguan sama sekali, sangat jelas.' },
      { type: 'READING', question: 'Passage: "The policy was met with widespread opposition from academics." What can be inferred?', options: ['Academics supported the policy', 'Most academics disagreed with the policy', 'Only a few academics opposed it', 'Academics were indifferent'], answer: 1, explanation: '"Widespread opposition" mengindikasikan bahwa sebagian besar akademisi menentang kebijakan tersebut.' },
      { type: 'READING', question: 'What is the purpose of a topic sentence in a paragraph?', options: ['To provide evidence', 'To introduce the main idea', 'To conclude the argument', 'To define a term'], answer: 1, explanation: 'Kalimat topik (topic sentence) memperkenalkan gagasan utama yang akan dikembangkan dalam paragraf.' },
      { type: 'READING', question: '"The terms are used interchangeably." What does "interchangeably" mean?', options: ['In different ways', 'In a fixed order', 'In place of each other', 'In a formal context'], answer: 2, explanation: '"Interchangeably" berarti dapat digunakan sebagai pengganti satu sama lain.' },
      { type: 'READING', question: 'Passage: "This approach, while novel, is fraught with risk." What does "fraught with" mean?', options: ['Free from', 'Full of', 'Reduced by', 'Enhanced by'], answer: 1, explanation: '"Fraught with" berarti penuh dengan atau dipenuhi oleh (biasanya hal negatif).' },
      { type: 'READING', question: 'Which organizational pattern uses "First..., Then..., Finally..."?', options: ['Problem-solution', 'Cause-effect', 'Chronological/sequential', 'Compare-contrast'], answer: 2, explanation: 'Kata-kata seperti "First", "Then", "Finally" menandai pola organisasi kronologis atau berurutan.' },
    ],
  },
  // ===================== 8. ACADEMIC WRITING (25 min, Sulit) → 20 soal =====================
  {
    id: 'writing', title: 'Academic Writing', subtitle: 'Latihan menyusun kalimat dan paragraf bahasa Inggris akademik yang efektif',
    icon: 'edit_note', color: 'from-lime-500 to-green-700', border: 'border-lime-200', badgeBg: 'bg-lime-100', badgeText: 'text-lime-800',
    tag: 'Menengah - Mahir', xpReward: 480, gemReward: 35, duration: '25 Menit', totalQ: 20, difficulty: 'Sulit', diffColor: 'text-lime-600',
    questions_data: [
      { type: 'WRITING', question: 'Which sentence is written in the correct passive voice?', options: ['The report written by the team.', 'The team was written the report.', 'The report was written by the team.', 'The report has write by the team.'], answer: 2, explanation: 'Passive voice: Subject + to be (was/were) + V3 + by + agent.' },
      { type: 'WRITING', question: 'Choose the best transition word: "The experiment failed. _____, the team revised their methodology."', options: ['Moreover', 'Nevertheless', 'Therefore', 'Similarly'], answer: 1, explanation: '"Nevertheless" menunjukkan kontras/ketekunan meskipun ada hambatan.' },
      { type: 'WRITING', question: 'Which sentence uses a formal academic tone correctly?', options: ['The results were kinda weird.', 'We got some pretty interesting findings.', 'The findings demonstrate a significant correlation.', 'Stuff happened that changed our results.'], answer: 2, explanation: 'Academic writing menggunakan bahasa formal dan presisi ilmiah.' },
      { type: 'WRITING', question: 'Identify the topic sentence for a paragraph about climate change:', options: ['Temperatures rose by 1.5°C.', 'Many animals are affected.', 'Climate change poses a critical threat to global ecosystems.', 'Glaciers are melting rapidly.'], answer: 2, explanation: 'Topic sentence memperkenalkan gagasan utama paragraf secara luas dan jelas.' },
      { type: 'WRITING', question: 'Which is the best way to cite a source?', options: ['According to someone, AI is great.', 'Smith (2022) argues that AI will reshape the workforce.', 'Somebody said AI will change everything.', 'The internet says AI is important.'], answer: 1, explanation: 'Format APA: Author (Year) + reporting verb + klaim.' },
      { type: 'WRITING', question: 'Which phrase introduces a contrast in academic writing?', options: ['Furthermore,', 'In addition,', 'However,', 'Similarly,'], answer: 2, explanation: '"However" adalah transisi kontras yang paling umum dalam academic writing.' },
      { type: 'WRITING', question: 'The conclusion of an academic essay should:', options: ['Introduce new arguments', 'Summarize key points and restate the thesis', 'Copy the introduction word-for-word', 'List all references'], answer: 1, explanation: 'Kesimpulan merangkum argumen utama dan menegaskan kembali tesis, tanpa memasukkan ide baru.' },
      { type: 'WRITING', question: 'Which is NOT an appropriate reporting verb in academic writing?', options: ['argues', 'claims', 'proves', 'gossips'], answer: 3, explanation: '"Gossips" tidak pernah digunakan sebagai reporting verb dalam konteks akademik.' },
      { type: 'WRITING', question: '"The researcher found that..." — What does the reporting verb "found" imply?', options: ['The researcher guessed', 'The researcher discovered through research', 'The researcher assumed', 'The researcher copied'], answer: 1, explanation: '"Found" sebagai reporting verb mengimplikasikan penemuan berdasarkan penelitian/eksperimen.' },
      { type: 'WRITING', question: 'Which sentence demonstrates hedging (memperlunak klaim)?', options: ['AI will definitely replace all teachers.', 'AI may potentially transform aspects of teaching.', 'AI is the best educational tool.', 'AI always improves student performance.'], answer: 1, explanation: 'Hedging menggunakan kata-kata seperti "may", "potentially", "suggests" untuk memperlunak klaim.' },
      { type: 'WRITING', question: '"This study is limited by its small sample size." This sentence discusses:', options: ['The study\'s methodology', 'The study\'s contribution', 'The study\'s limitation', 'The study\'s recommendation'], answer: 2, explanation: 'Pernyataan keterbatasan (limitation) menjelaskan kelemahan atau batasan penelitian.' },
      { type: 'WRITING', question: 'Which word signals addition of information?', options: ['However', 'Although', 'Furthermore', 'Despite'], answer: 2, explanation: '"Furthermore" (juga: "moreover", "in addition") menambahkan informasi baru.' },
      { type: 'WRITING', question: '"The results indicate that..." What function does "indicate" serve?', options: ['To contradict', 'To report findings tentatively', 'To prove absolutely', 'To question the results'], answer: 1, explanation: '"Indicate" adalah hedging verb yang menyajikan hasil dengan kehati-hatian ilmiah.' },
      { type: 'WRITING', question: 'An abstract in academic writing should include:', options: ['Full methodology details', 'A brief overview of purpose, method, findings, and conclusion', 'Only the conclusion', 'Personal opinions'], answer: 1, explanation: 'Abstrak berisi ringkasan singkat dari tujuan, metode, temuan, dan kesimpulan penelitian.' },
      { type: 'WRITING', question: 'Which is a characteristic of academic writing?', options: ['Conversational tone', 'First-person narrative throughout', 'Objective and evidence-based language', 'Emotional appeals'], answer: 2, explanation: 'Academic writing bersifat objektif, berbasis bukti, dan menggunakan bahasa formal.' },
      { type: 'WRITING', question: 'Choose the most formal way to express "The problem got bigger":',  options: ['The issue escalated significantly.', 'The problem got way bigger.', 'Things became a bigger problem.', 'It got more problematic, like, a lot.'], answer: 0, explanation: '"Escalated significantly" adalah ekspresi paling formal dan tepat untuk konteks akademik.' },
      { type: 'WRITING', question: 'Which connective introduces an example?', options: ['Nevertheless', 'For instance,', 'Therefore,', 'In contrast,'], answer: 1, explanation: '"For instance" (dan "for example", "such as") digunakan untuk memperkenalkan contoh.' },
      { type: 'WRITING', question: 'What is the function of a literature review?', options: ['To list all books read', 'To summarize existing research on a topic', 'To present original data only', 'To write personal reflections'], answer: 1, explanation: 'Literature review merangkum dan menganalisis penelitian yang sudah ada terkait topik.' },
      { type: 'WRITING', question: '"Notwithstanding the challenges, the project succeeded." "Notwithstanding" means:', options: ['Because of', 'In spite of', 'As a result of', 'In addition to'], answer: 1, explanation: '"Notwithstanding" adalah kata formal yang berarti "meskipun" atau "in spite of".' },
      { type: 'WRITING', question: 'Which sentence avoids first-person and maintains formal tone?', options: ['I think the results show that...', 'We can conclude from the data...', 'The findings suggest that...', 'In my opinion, the experiment worked.'], answer: 2, explanation: '"The findings suggest that" menghindari first-person dan bersifat impersonal sesuai academic writing.' },
    ],
  },
  // ===================== 9. ACADEMIC ENGLISH (25 min, Sulit) → 20 soal =====================
  {
    id: 'academic', title: 'Academic English', subtitle: 'Kuasai kosakata dan frasa khas yang digunakan dalam konteks akademik dan ilmiah',
    icon: 'school', color: 'from-fuchsia-500 to-purple-700', border: 'border-fuchsia-200', badgeBg: 'bg-fuchsia-100', badgeText: 'text-fuchsia-800',
    tag: 'Mahir', xpReward: 550, gemReward: 40, duration: '25 Menit', totalQ: 20, difficulty: 'Sulit', diffColor: 'text-fuchsia-600',
    questions_data: [
      { type: 'ACADEMIC', question: 'In academic writing, "the study aims to..." is used to state the:', options: ['Conclusion', 'Limitation', 'Objective', 'Methodology'], answer: 2, explanation: '"Aims to" menyatakan tujuan atau objektif penelitian.' },
      { type: 'ACADEMIC', question: 'Which phrase introduces a counter-argument?', options: ['As a result,', 'Furthermore,', 'On the other hand,', 'In addition,'], answer: 2, explanation: '"On the other hand" memperkenalkan pandangan yang berlawanan.' },
      { type: 'ACADEMIC', question: '"Empirical evidence" refers to:', options: ['Evidence based on theories', 'Evidence from observation and experiment', 'Evidence from popular opinion', 'Evidence from historical records only'], answer: 1, explanation: 'Empirical evidence adalah data yang dikumpulkan melalui observasi dan eksperimen.' },
      { type: 'ACADEMIC', question: 'What does "peer-reviewed" mean?', options: ['Reviewed by students', 'Reviewed by experts in the same field', 'Reviewed by the author', 'Reviewed by the public'], answer: 1, explanation: 'Peer review adalah proses evaluasi oleh para ahli di bidang yang sama.' },
      { type: 'ACADEMIC', question: 'Which word best completes: "The researcher _____ that further study is needed."', options: ['tells', 'says', 'acknowledges', 'speaks'], answer: 2, explanation: '"Acknowledges" adalah reporting verb akademik yang paling tepat di sini.' },
      { type: 'ACADEMIC', question: '"The hypothesis was substantiated by the data." "Substantiated" means:', options: ['Disproved', 'Supported', 'Questioned', 'Ignored'], answer: 1, explanation: '"Substantiated" berarti dikuatkan atau didukung oleh bukti.' },
      { type: 'ACADEMIC', question: 'What is a "thesis statement" in an academic essay?', options: ['A summary of all sources used', 'The main argument or claim of the essay', 'A question to be answered', 'The title of the essay'], answer: 1, explanation: 'Thesis statement adalah pernyataan utama yang menjadi argumen sentral esai.' },
      { type: 'ACADEMIC', question: '"The study corroborates previous findings." "Corroborates" means:', options: ['Contradicts', 'Confirms', 'Ignores', 'Challenges'], answer: 1, explanation: '"Corroborates" berarti mengkonfirmasi atau memperkuat temuan sebelumnya.' },
      { type: 'ACADEMIC', question: 'Which academic term means "the process of testing a hypothesis"?', options: ['Thesis', 'Paradigm', 'Empiricism', 'Experimentation'], answer: 3, explanation: '"Experimentation" adalah proses menguji hipotesis melalui percobaan terkontrol.' },
      { type: 'ACADEMIC', question: '"A priori" knowledge is knowledge that is:', options: ['Based on experiment', 'Known through experience', 'Known through reason without experience', 'Unknown'], answer: 2, explanation: '"A priori" knowledge diketahui melalui logika/akal murni, tidak bergantung pada pengalaman.' },
      { type: 'ACADEMIC', question: 'What does "synthesize" mean in academic context?', options: ['Summarize only one source', 'Combine information from multiple sources into a coherent whole', 'Copy sources verbatim', 'Disagree with sources'], answer: 1, explanation: '"Synthesize" berarti menggabungkan informasi dari berbagai sumber menjadi argumen yang koheren.' },
      { type: 'ACADEMIC', question: '"The variable was controlled to eliminate bias." "Bias" refers to:', options: ['A mathematical error', 'Random chance', 'A systematic deviation from the truth', 'Missing data'], answer: 2, explanation: 'Bias adalah penyimpangan sistematis yang dapat mempengaruhi hasil penelitian.' },
      { type: 'ACADEMIC', question: 'What is the difference between "qualitative" and "quantitative" research?', options: ['Qualitative uses numbers, quantitative uses words', 'Qualitative explores meaning, quantitative measures numerical data', 'They are the same', 'Qualitative is more accurate than quantitative'], answer: 1, explanation: 'Kualitatif fokus pada eksplorasi makna/pengalaman; kuantitatif pada pengukuran numerik.' },
      { type: 'ACADEMIC', question: '"This research has significant implications for the field." "Implications" means:', options: ['Limitations', 'Potential effects or consequences', 'Mistakes', 'References'], answer: 1, explanation: '"Implications" merujuk pada konsekuensi atau dampak potensial dari suatu temuan.' },
      { type: 'ACADEMIC', question: 'Which word means "to make a claim without sufficient evidence"?', options: ['To substantiate', 'To assert', 'To corroborate', 'To verify'], answer: 1, explanation: '"Assert" berarti menyatakan sesuatu dengan keyakinan, seringkali tanpa bukti cukup.' },
      { type: 'ACADEMIC', question: '"The study employed a longitudinal design." "Longitudinal" means:', options: ['Over a short time period', 'Over a long time period', 'Using a single group', 'Using a laboratory setting'], answer: 1, explanation: 'Longitudinal study mengamati subjek yang sama selama periode waktu yang panjang.' },
      { type: 'ACADEMIC', question: 'Which term refers to copying someone\'s work without credit?', options: ['Paraphrasing', 'Plagiarism', 'Summarizing', 'Citing'], answer: 1, explanation: 'Plagiarism adalah penggunaan karya orang lain tanpa memberikan kredit yang sesuai.' },
      { type: 'ACADEMIC', question: '"The methodology section describes how the research _____ conducted."', options: ['is', 'was', 'were', 'had'], answer: 1, explanation: 'Methodology section dalam research paper menggunakan past tense ("was conducted") karena penelitian sudah dilakukan.' },
      { type: 'ACADEMIC', question: 'What does "triangulation" mean in qualitative research?', options: ['Using three participants only', 'Using multiple methods or sources to validate findings', 'A type of statistical test', 'A geometric measurement tool'], answer: 1, explanation: 'Triangulation menggunakan berbagai metode/sumber data untuk meningkatkan kredibilitas temuan.' },
      { type: 'ACADEMIC', question: '"The results are statistically significant." This means:', options: ['The results are very large', 'The results are unlikely to have occurred by chance', 'The results are practically important', 'The results are surprising'], answer: 1, explanation: 'Statistical significance berarti kemungkinan hasil terjadi secara kebetulan sangat kecil (p < 0.05).' },
    ],
  },
  // ===================== 10. MIXED ENGLISH QUIZ (35 min, Campuran) → 25 soal =====================
  {
    id: 'mixed', title: 'Mixed English Quiz', subtitle: 'Kombinasi soal vocabulary, grammar, dan reading dalam satu sesi',
    icon: 'shuffle', color: 'from-amber-500 to-orange-600', border: 'border-amber-200', badgeBg: 'bg-amber-100', badgeText: 'text-amber-800',
    tag: 'Menengah - Mahir', xpReward: 600, gemReward: 40, duration: '35 Menit', totalQ: 25, difficulty: 'Campuran', diffColor: 'text-amber-600',
    questions_data: [
      { type: 'MIXED', question: 'The scientist\'s hypothesis was _____ by the experimental data.', options: ['refuted', 'elevated', 'diminished', 'prolonged'], answer: 0, explanation: '"Refuted" berarti dibantah/disangkal oleh bukti.' },
      { type: 'MIXED', question: 'If I _____ harder, I would have passed the exam.', options: ['study', 'studied', 'had studied', 'have studied'], answer: 2, explanation: 'Third Conditional: "If + Past Perfect, would have + V3".' },
      { type: 'MIXED', question: 'The antonym of "transparent" is:', options: ['Clear', 'Opaque', 'Luminous', 'Visible'], answer: 1, explanation: '"Transparent" (tembus pandang) → antonim "opaque" (tidak tembus cahaya).' },
      { type: 'MIXED', question: 'Select the best phrase: "He is looking forward _____ you."', options: ['to meet', 'to meeting', 'meeting', 'meet'], answer: 1, explanation: '"Look forward to" selalu diikuti Verb-ing (Gerund).' },
      { type: 'MIXED', question: 'Which is correctly spelled?', options: ['Accommodate', 'Acommodate', 'Accomodate', 'Accomadate'], answer: 0, explanation: 'Ejaan yang benar: dua "c" dan dua "m": "accommodate".' },
      { type: 'MIXED', question: '"Albeit" is closest in meaning to:', options: ['Therefore', 'Although', 'Moreover', 'Because'], answer: 1, explanation: '"Albeit" adalah kata formal yang berarti "although" (meskipun).' },
      { type: 'MIXED', question: 'Choose the correct form: "She suggested that he _____ a doctor."', options: ['sees', 'see', 'saw', 'will see'], answer: 1, explanation: 'Setelah "suggest that", gunakan subjunctive (base form): "see".' },
      { type: 'MIXED', question: '"The project was _____ on time, much to everyone\'s surprise."', options: ['complete', 'completed', 'completing', 'completion'], answer: 1, explanation: 'Passive voice membutuhkan past participle: "was completed".' },
      { type: 'MIXED', question: 'What does "exacerbate" mean?', options: ['To solve a problem', 'To make a situation worse', 'To analyze carefully', 'To ignore'], answer: 1, explanation: '"Exacerbate" berarti memperparah atau memperburuk suatu kondisi.' },
      { type: 'MIXED', question: 'Which connective word signals cause?', options: ['Nevertheless', 'Since', 'Although', 'Despite'], answer: 1, explanation: '"Since" dapat digunakan sebagai kata penghubung sebab-akibat (karena).' },
      { type: 'MIXED', question: '"No sooner _____ arrived than the meeting started."', options: ['she had', 'had she', 'she has', 'has she'], answer: 1, explanation: '"No sooner" memerlukan inversion: "No sooner had + subject + V3".' },
      { type: 'MIXED', question: 'The word "mitigate" means:', options: ['To worsen', 'To lessen or reduce', 'To prevent', 'To investigate'], answer: 1, explanation: '"Mitigate" berarti mengurangi tingkat keparahan atau dampak negatif.' },
      { type: 'MIXED', question: 'Which sentence is in the present perfect tense?', options: ['She studies every day.', 'She studied yesterday.', 'She has studied for two hours.', 'She was studying.'], answer: 2, explanation: 'Present perfect: "has/have + V3". "She has studied" menyatakan aksi yang baru selesai.' },
      { type: 'MIXED', question: '"The research was _____ to determine the long-term effects."', options: ['undertook', 'undertaken', 'undertaking', 'underway'], answer: 1, explanation: 'Passive voice: "was + past participle". Bentuk V3 dari "undertake" adalah "undertaken".' },
      { type: 'MIXED', question: '"Prolific" most nearly means:', options: ['Lazy', 'Highly productive', 'Creative', 'Disorganized'], answer: 1, explanation: '"Prolific" berarti sangat produktif atau menghasilkan banyak karya.' },
      { type: 'MIXED', question: 'Which sentence correctly uses a gerund?', options: ['She wants swim every morning.', 'Swimming is her favorite activity.', 'She enjoys to swim.', 'She is good to swim.'], answer: 1, explanation: '"Swimming" sebagai gerund berfungsi sebagai subjek kalimat: "Swimming is...".' },
      { type: 'MIXED', question: 'What type of sentence is: "Although it rained, we continued the event."?', options: ['Simple', 'Compound', 'Complex', 'Compound-complex'], answer: 2, explanation: 'Kalimat Complex memiliki satu independent clause + satu/lebih dependent clause.' },
      { type: 'MIXED', question: '"The evidence is irrefutable." "Irrefutable" means:', options: ['Doubtful', 'Cannot be denied or disproved', 'Partially true', 'Easily challenged'], answer: 1, explanation: '"Irrefutable" berarti tidak dapat disangkal atau dibantah.' },
      { type: 'MIXED', question: 'Choose the word that does NOT belong: "analyze, examine, investigate, ignore, assess"', options: ['analyze', 'ignore', 'examine', 'assess'], answer: 1, explanation: '"Ignore" berarti mengabaikan, berlawanan dengan kata-kata lain yang bermakna mempelajari/meneliti.' },
      { type: 'MIXED', question: '"The lecture was _____ by technical difficulties." (passive)', options: ['interrupted', 'interrupting', 'interrupt', 'have interrupted'], answer: 0, explanation: 'Passive: "was + past participle". V3 dari "interrupt" adalah "interrupted".' },
      { type: 'MIXED', question: '"Her argument was cogent." "Cogent" means:', options: ['Weak and illogical', 'Clear, logical, and convincing', 'Emotional and passionate', 'Vague and unclear'], answer: 1, explanation: '"Cogent" berarti jernih, logis, dan meyakinkan.' },
      { type: 'MIXED', question: 'Which tense is used: "By 2030, the world will have consumed..."?', options: ['Future simple', 'Future continuous', 'Future perfect', 'Present perfect'], answer: 2, explanation: 'Future perfect: "will have + V3" untuk aksi yang akan selesai sebelum waktu tertentu di masa depan.' },
      { type: 'MIXED', question: '"Myriad" means:', options: ['A small number', 'A specific number', 'A countless or very large number', 'An average number'], answer: 2, explanation: '"Myriad" berarti jumlah yang sangat banyak atau tak terhitung.' },
      { type: 'MIXED', question: 'What is a "bibliography"?', options: ['The author\'s biography', 'A list of sources referenced in a work', 'A type of data analysis', 'The index of a book'], answer: 1, explanation: 'Bibliography adalah daftar sumber yang dikutip atau dijadikan referensi dalam suatu karya.' },
      { type: 'MIXED', question: '"The policy _____ since last year." (present perfect passive)', options: ['has been implemented', 'have been implemented', 'was implemented', 'is implemented'], answer: 0, explanation: 'Present perfect passive: "has/have been + V3". Untuk "the policy" (singular) → "has been implemented".' },
    ],
  },
  // ===================== 11. EELS SIMULATION (40 min, Expert) → 30 soal =====================
  {
    id: 'eels_simulation', title: 'EELS Simulation', subtitle: 'Simulasi soal EELS (English as Extra Language Score) setara ujian resmi',
    icon: 'assignment', color: 'from-red-600 to-rose-800', border: 'border-red-200', badgeBg: 'bg-red-100', badgeText: 'text-red-800',
    tag: 'Mahir', xpReward: 700, gemReward: 50, duration: '40 Menit', totalQ: 30, difficulty: 'Expert', diffColor: 'text-red-600',
    questions_data: [
      { type: 'EELS', question: 'Not until the final results were published _____ the significance of the discovery.', options: ['scientists recognized', 'did scientists recognize', 'scientists did recognize', 'recognized scientists'], answer: 1, explanation: '"Not until" triggers negative inversion: auxiliary + subject + verb base.' },
      { type: 'EELS', question: 'The committee recommended that each participant _____ a written summary.', options: ['submits', 'submit', 'submitted', 'will submit'], answer: 1, explanation: 'After "recommend that", the subjunctive mood requires base form verb.' },
      { type: 'EELS', question: 'Seldom _____ such a comprehensive analysis of this phenomenon.', options: ['has anyone conducted', 'anyone has conducted', 'anyone conducted', 'has anyone been conducted'], answer: 0, explanation: '"Seldom" at the start requires subject-auxiliary inversion.' },
      { type: 'EELS', question: 'Choose the sentence with correct parallel structure:', options: ['She enjoys reading, to write, and painting.', 'She enjoys reading, writing, and to paint.', 'She enjoys reading, writing, and painting.', 'She enjoys to read, writing, and painting.'], answer: 2, explanation: 'Parallel structure requires all list items in the same grammatical form: Gerund (V-ing).' },
      { type: 'EELS', question: '_____ the data were collected, the researchers began the analysis.', options: ['While', 'Once', 'Despite', 'Although'], answer: 1, explanation: '"Once" signals that one action is completed before another begins.' },
      { type: 'EELS', question: 'The findings (A) strongly suggests (B) that the intervention (C) was effective (D).', options: ['A', 'B', 'C', 'D'], answer: 1, explanation: '"Findings" is plural, so the verb should be "suggest" not "suggests" (B is the error).' },
      { type: 'EELS', question: '"The growth rate increased _____ the economic downturn." (contrast)', options: ['because of', 'as a result of', 'despite', 'due to'], answer: 2, explanation: '"Despite" introduces a contrast (growth despite downturn).' },
      { type: 'EELS', question: 'Identify the correct sentence:', options: ['Having submitted the report, the deadline was met.', 'Having submitted the report, she met the deadline.', 'She having submitted the report, the deadline was met.', 'The deadline having met, she submitted the report.'], answer: 1, explanation: 'Dangling modifier fix: the subject of the participial phrase must match the main clause subject.' },
      { type: 'EELS', question: '"The magnitude of the impact cannot be _____ overstated."', options: ['enough', 'too', 'very', 'quite'], answer: 1, explanation: '"Cannot be too + adjective/adverb" means "it is impossible to exaggerate it too much".' },
      { type: 'EELS', question: 'Choose the correct form: "The experiment, conducted (A) under strict conditions, yielded (B) results that were (C) unprecedented (D)."', options: ['A', 'B', 'C', 'D'], answer: 3, explanation: 'All parts are grammatically correct. "Unprecedented" (D) means never having happened before, used correctly here.' },
      { type: 'EELS', question: '"Little _____ that the discovery would change everything."', options: ['he knew', 'did he know', 'knew he', 'he did know'], answer: 1, explanation: '"Little" as a negative adverb at the start triggers inversion: Little + did + subject + know.' },
      { type: 'EELS', question: '"The research was carried _____ by a team of scientists."', options: ['on', 'out', 'over', 'in'], answer: 1, explanation: '"Carry out" is a phrasal verb meaning to conduct/perform. "The research was carried out" is correct.' },
      { type: 'EELS', question: 'What type of error is in: "She works hardly every day"?', options: ['Tense error', 'Adverb error', 'Subject-verb agreement', 'Article error'], answer: 1, explanation: '"Hardly" means "almost not", not "with great effort". The correct word is "hard" (adverb).' },
      { type: 'EELS', question: '"The impact of social media on academic performance is _____ contested."', options: ['hotly', 'hardly', 'largely', 'deeply'], answer: 0, explanation: '"Hotly contested" is a common collocation meaning "strongly debated".' },
      { type: 'EELS', question: 'Which sentence uses "whereas" correctly?', options: ['He studied hard, whereas he failed.', 'Whereas urban areas grew, rural areas declined.', 'He passed the exam, whereas studied hard.', 'Whereas to succeed, he must study.'], answer: 1, explanation: '"Whereas" is a conjunction showing contrast between two clauses, used correctly in B.' },
      { type: 'EELS', question: '"By the time the conference begins, she _____ her presentation three times."', options: ['rehearsed', 'has rehearsed', 'will have rehearsed', 'had rehearsed'], answer: 2, explanation: 'Future perfect ("will have + V3") for action completed before a future point.' },
      { type: 'EELS', question: 'Choose the word with the correct prefix: "His behavior was _____ of a true scholar." (not typical)', options: ['uncharacteristic', 'discharacteristic', 'incharacteristic', 'mischaracteristic'], answer: 0, explanation: '"Uncharacteristic" is the correct word meaning "not typical of".' },
      { type: 'EELS', question: 'Identify the error: "The number of students who enrolls each year are increasing."', options: ['"who enrolls"', '"each year"', '"are increasing"', 'No error'], answer: 0, explanation: '"Who" refers to "students" (plural), so it should be "who enroll". Also "are" is correct for the main clause.' },
      { type: 'EELS', question: '"The implications of the study are far-_____."', options: ['reaching', 'reached', 'reach', 'reaches'], answer: 0, explanation: '"Far-reaching" is a compound adjective meaning having extensive effects.' },
      { type: 'EELS', question: 'Which sentence contains a gerund used as a subject?', options: ['She is swimming now.', 'Swimming in the lake was prohibited.', 'He likes to swim.', 'They will swim tomorrow.'], answer: 1, explanation: '"Swimming" at the beginning acts as a gerund (verb-noun) functioning as the subject.' },
      { type: 'EELS', question: '"The data are _____ to suggest a causal relationship." (insufficient)', options: ['inadequate', 'sufficient', 'enough', 'appropriate'], answer: 0, explanation: '"Inadequate" means not sufficient or not enough to meet a requirement.' },
      { type: 'EELS', question: 'Which word can replace "however" to show contrast?', options: ['Therefore', 'Consequently', 'Nevertheless', 'Furthermore'], answer: 2, explanation: '"Nevertheless" (like "however") introduces a contrasting or concessive idea.' },
      { type: 'EELS', question: '"He was given a scholarship _____ his outstanding academic record."', options: ['in spite of', 'owing to', 'regardless of', 'despite'], answer: 1, explanation: '"Owing to" means "because of" and is used to introduce a reason.' },
      { type: 'EELS', question: 'Choose the correct passive: "The policy _____ by the administration last year."', options: ['is revised', 'was revised', 'revised', 'has revised'], answer: 1, explanation: '"Last year" indicates past time, so passive past tense: "was revised".' },
      { type: 'EELS', question: '"A growing body of evidence _____ the link between sleep and cognitive function."', options: ['support', 'supports', 'are supporting', 'have supported'], answer: 1, explanation: '"A growing body of evidence" is singular (the body), so verb is singular: "supports".' },
      { type: 'EELS', question: 'Error identification: "Neither the professor nor the students was prepared."', options: ['"Neither"', '"nor"', '"was prepared"', 'No error'], answer: 2, explanation: 'With "neither...nor", verb agrees with the nearest subject "the students" (plural) → "were prepared".' },
      { type: 'EELS', question: '"The experiment _____ in controlled conditions to minimize variables."', options: ['was conducted', 'conducted', 'conducting', 'has conducted'], answer: 0, explanation: 'Passive voice + past tense for describing completed research: "was conducted".' },
      { type: 'EELS', question: '"Notwithstanding the setbacks, the research team persisted." "Notwithstanding" is synonymous with:', options: ['Because of', 'Despite', 'Due to', 'As a result of'], answer: 1, explanation: '"Notwithstanding" is a formal word meaning "despite" or "in spite of".' },
      { type: 'EELS', question: '"The committee reached _____ consensus after hours of deliberation."', options: ['a', 'an', 'the', 'no article'], answer: 0, explanation: '"A consensus" is the correct article usage here (countable noun, first mention).' },
      { type: 'EELS', question: '"The research builds _____ previous studies in the field."', options: ['in', 'over', 'on', 'at'], answer: 2, explanation: '"Build on" is the correct phrasal verb meaning to use something as a foundation.' },
    ],
  },
];

function QuizSelectionScreen({ onSelectQuiz }) {
  const navigate = useNavigate();
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-black border border-rose-200">
          <span className="material-symbols-outlined text-sm">sports_esports</span>
          QUIZ ARENA
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
          Pilih Tantangan Kuis<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-600">yang Ingin Kamu Kerjakan</span>
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
          Setiap kuis dirancang untuk mengasah kemampuan bahasa Inggrismu secara terarah. Pilih kategori dan mulai tantanganmu!
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap items-center justify-center gap-3 text-xs">
        {[
          { icon: 'bolt', label: '6 Kategori Kuis', color: 'text-amber-600' },
          { icon: 'workspace_premium', label: 'Reward XP & Gems', color: 'text-violet-600' },
          { icon: 'timer', label: '10 - 35 Menit', color: 'text-sky-600' },
          { icon: 'trending_up', label: 'Semua Level', color: 'text-emerald-600' },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-xs font-bold text-slate-700">
            <span className={"material-symbols-outlined text-sm " + s.color}>{s.icon}</span>
            {s.label}
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {QUIZ_CATALOGUE.map((quiz, i) => (
          <motion.div key={quiz.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={"relative bg-white rounded-3xl border-2 " + quiz.border + " shadow-sm overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"}
            onClick={() => onSelectQuiz(quiz)}>
            <div className={"bg-gradient-to-br " + quiz.color + " p-5 relative overflow-hidden"}>
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
              <div className="absolute -right-8 -bottom-6 w-32 h-32 bg-white/10 rounded-full" />
              <div className="relative flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <span className="material-symbols-outlined text-2xl text-white">{quiz.icon}</span>
                </div>
                <div className={quiz.badgeBg + " " + quiz.badgeText + " text-[10px] font-black px-2.5 py-1 rounded-full"}>{quiz.tag}</div>
              </div>
              <h3 className="mt-3 text-base font-black text-white leading-tight">{quiz.title}</h3>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{quiz.subtitle}</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: 'quiz', val: quiz.totalQ + ' Soal' },
                  { icon: 'timer', val: quiz.duration },
                  { icon: 'signal_cellular_alt', val: quiz.difficulty, cls: quiz.diffColor },
                ].map((s) => (
                  <div key={s.icon} className="flex flex-col items-center gap-0.5 bg-slate-50 rounded-xl p-2 border border-slate-100">
                    <span className={"material-symbols-outlined text-sm " + (s.cls || 'text-slate-500')}>{s.icon}</span>
                    <span className={"text-[10px] font-black " + (s.cls || 'text-slate-600')}>{s.val}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 rounded-lg border border-amber-200 text-amber-700 text-[10px] font-black">
                  <span className="material-symbols-outlined text-xs">bolt</span>+{quiz.xpReward} XP
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 bg-sky-50 rounded-lg border border-sky-200 text-sky-700 text-[10px] font-black">
                  <span className="material-symbols-outlined text-xs">diamond</span>+{quiz.gemReward} Gems
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.97 }}
                className={"w-full py-2.5 px-4 rounded-xl font-black text-xs text-white bg-gradient-to-r " + quiz.color + " border-b-[3px] border-black/20 shadow-sm flex items-center justify-center gap-1.5"}>
                <span className="material-symbols-outlined text-sm">play_arrow</span>
                Mulai Kuis
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}

function QuizArena({ quiz, onBack }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [userStats, setUserStats] = useState({ level: 1, sp_barrier: 100, max_sp: 100 });

  useEffect(() => {
    if (!user) return;
    supabase.from('user_stats').select('*').eq('user_id', user.id).single()
      .then(({ data }) => { if (data) setUserStats(data); });
  }, [user]);

  const addXP = async (amount) => {
    if (!user) return;
    const { data } = await supabase.from('user_stats').select('total_xp').eq('user_id', user.id).single();
    if (data) await supabase.from('user_stats').update({ total_xp: (data.total_xp || 0) + amount }).eq('user_id', user.id);
  };
  const addGems = async (amount) => {
    if (!user) return;
    const { data } = await supabase.from('user_stats').select('gems').eq('user_id', user.id).single();
    if (data) await supabase.from('user_stats').update({ gems: (data.gems || 0) + amount }).eq('user_id', user.id);
  };

  const questions = quiz.questions_data;
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [score, setScore] = useState(0);
  const [battleLog, setBattleLog] = useState([
    'Quiz "' + quiz.title + '" dimulai! Jawab setiap soal dengan tepat.',
    'Status Mahasiswa: Evaluasi aktif (' + userStats.sp_barrier + ' SP).',
  ]);

  const totalQuestions = questions.length;
  const secMap = { reading: 1800, mixed: 2100, grammar: 1500 };
  const [timeLeft, setTimeLeft] = useState(secMap[quiz.id] || 1200);

  useEffect(() => {
    const timer = setInterval(() => { setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)); }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0');
  };

  const currentQ = questions[currentQIndex];

  const handleSelectOption = (idx) => { if (!isAnswered) setSelectedOption(idx); };

  const handleSubmit = () => {
    if (selectedOption === null || isAnswered) return;
    const correct = selectedOption === currentQ.answer;
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) {
      setScore((prev) => prev + 25);
      setBattleLog((prev) => ['Jawaban TEPAT! Kamu memperoleh +25 Poin!', ...prev]);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      setBattleLog((prev) => ['Jawaban belum tepat. Cermati penjelasan kaidah dan coba soal berikutnya.', ...prev]);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    if (currentQIndex < totalQuestions - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setIsVictory(true);
      addXP(quiz.xpReward);
      addGems(quiz.gemReward);
      confetti({ particleCount: 180, spread: 100, origin: { y: 0.5 } });
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 space-y-6">
      <section className="bg-white rounded-3xl p-5 md:p-6 border border-rose-200/80 shadow-md relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative shrink-0">
              <div className={"w-20 h-20 rounded-2xl bg-gradient-to-br " + quiz.color + " p-1 border-2 border-rose-400 shadow-md flex items-center justify-center text-white"}>
                <span className="material-symbols-outlined text-4xl">{quiz.icon}</span>
              </div>
              <span className="absolute -top-2 -left-2 bg-rose-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full border-2 border-white shadow-xs">Quiz Arena</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg md:text-xl font-black text-slate-900 leading-tight">{quiz.title}</h1>
                <span className={quiz.badgeBg + " " + quiz.badgeText + " px-2 py-0.5 rounded-md text-[10px] font-black border"}>{quiz.tag}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{quiz.subtitle}</p>
            </div>
          </div>
          <div className="w-full lg:flex-1 max-w-xl flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-black">
              <span className="text-rose-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
                Progress Tantangan Kuis
              </span>
              <span className="text-rose-900 font-extrabold">Soal {currentQIndex + 1} / {totalQuestions} - Skor: {score} Poin</span>
            </div>
            <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <motion.div className={"h-full bg-gradient-to-r " + quiz.color + " rounded-full shadow-inner"} style={{ width: (currentQIndex / totalQuestions * 100) + '%' }} transition={{ duration: 0.5 }} />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500 font-bold">
              <button onClick={onBack} className="flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-xs">arrow_back</span>
                Ganti Kuis
              </button>
              <span className="text-emerald-600">+25 Poin per jawaban benar</span>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-3 bg-rose-50 border-2 border-rose-200 px-4 py-2.5 rounded-2xl shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center animate-bounce">
              <span className="material-symbols-outlined text-lg">alarm</span>
            </div>
            <div>
              <div className="text-[9px] font-black uppercase text-rose-500 tracking-wider">Waktu Tersisa</div>
              <div className="text-base font-black text-rose-900">{formatTime(timeLeft)}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600">person</span>
                <span className="font-extrabold text-xs text-slate-800">Profil Mahasiswa</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-black">Level {userStats.level}</span>
            </div>
            <div className="my-4 flex flex-col items-center text-center">
              <HootieMascot mood={isCorrect ? 'cheer' : 'fire'} size="lg" />
              <h2 className="mt-2 text-sm font-black text-slate-900">{user ? user.name : 'Budi Santoso'}</h2>
              <p className="text-[11px] text-slate-500">{quiz.title}</p>
            </div>
            <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
              <div className="flex justify-between text-[11px] font-black">
                <span className="text-sky-600 flex items-center gap-1"><span className="material-symbols-outlined text-xs">security</span> Ketahanan Kuis</span>
                <span className="text-sky-700">{userStats.sp_barrier} / {userStats.max_sp} SP</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: (userStats.sp_barrier / userStats.max_sp * 100) + '%' }} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
              <span className="material-symbols-outlined text-amber-500 text-sm">local_fire_department</span>
              <span className="text-[11px] font-bold">Bonus Streak: +20% Poin</span>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-sm flex flex-col justify-between min-h-[460px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={quiz.badgeBg + " " + quiz.badgeText + " px-3 py-1 rounded-full text-xs font-black uppercase"}>{currentQ.type} #{currentQIndex + 1}</span>
                <span className="text-xs font-bold text-slate-400">Skor: +25 Poin EELS</span>
              </div>
              <h3 className="text-base md:text-lg font-black text-slate-900 leading-relaxed mb-6">{currentQ.question}</h3>
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  let style = 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800';
                  if (isAnswered) {
                    if (idx === currentQ.answer) style = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500';
                    else if (isSelected && !isCorrect) style = 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500';
                    else style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  } else if (isSelected) { style = 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500'; }
                  return (
                    <motion.button key={idx} whileTap={{ scale: 0.98 }} onClick={() => handleSelectOption(idx)} disabled={isAnswered}
                      className={"w-full p-4 rounded-2xl border-2 border-b-[5px] text-left font-bold text-xs md:text-sm flex items-center justify-between transition-all cursor-pointer " + style}>
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-black">{String.fromCharCode(65 + idx)}</span>
                        <span>{opt}</span>
                      </div>
                      {isAnswered && idx === currentQ.answer && <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>}
                    </motion.button>
                  );
                })}
              </div>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <AnimatePresence>
                {isAnswered && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={"p-3.5 rounded-2xl mb-4 text-xs " + (isCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-rose-50 border border-rose-200 text-rose-900')}>
                    <p className="font-extrabold mb-1">{isCorrect ? 'Jawaban Tepat!' : 'Kaidah / Penjelasan:'}</p>
                    <p className="leading-relaxed opacity-90">{currentQ.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {!isAnswered ? (
                <button onClick={handleSubmit} disabled={selectedOption === null}
                  className={"tactile-btn w-full py-3.5 px-4 font-black text-xs rounded-xl border-b-[4px] flex items-center justify-center gap-2 shadow-sm cursor-pointer " +
                    (selectedOption !== null ? "bg-gradient-to-r " + quiz.color + " text-white border-black/20" : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed')}>
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  Kirim Jawaban (+25 Poin)
                </button>
              ) : (
                <button onClick={handleNext} className="tactile-btn w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl border-b-[4px] border-indigo-900 flex items-center justify-center gap-2 shadow-sm cursor-pointer">
                  {currentQIndex < totalQuestions - 1 ? 'Lanjut ke Soal Berikutnya' : 'Selesaikan Kuis'}
                </button>
              )}
            </div>
          </div>
        </main>

        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-amber-500">receipt_long</span>
              <h4 className="font-extrabold text-xs text-slate-900">Catatan Aktivitas Kuis</h4>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto text-[11px] pr-1">
              {battleLog.map((log, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-700 leading-snug">{log}</div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-5 border border-indigo-200">
            <div className="flex items-center gap-2 mb-2 text-indigo-900">
              <span className="material-symbols-outlined text-base">menu_book</span>
              <h4 className="font-black text-xs">Petunjuk Kaidah (Hint)</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {quiz.id === 'grammar' ? 'Perhatikan kaidah inversi, concord, dan tense consistency dalam setiap kalimat.'
               : quiz.id === 'vocabulary' ? 'Pahami konteks kalimat untuk menentukan sinonim atau antonim yang paling tepat.'
               : quiz.id === 'reading' ? 'Baca teks secara aktif: cari ide pokok dan apa yang penulis ingin sampaikan.'
               : quiz.id === 'conversation' ? 'Pilih respons yang paling sopan, informatif, dan sesuai konteks akademik.'
               : 'Gunakan strategi eliminasi: buang opsi yang jelas salah, fokus pada dua pilihan terbaik.'}
            </p>
          </div>
        </aside>
      </div>

      {isVictory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full text-center border-4 border-amber-400 shadow-2xl relative">
            <HootieMascot mood="celebrate" speech="KUIS SELESAI!" size="hero" />
            <h2 className="text-2xl font-black text-slate-900 mt-4">Hebat! Kuis Selesai!</h2>
            <p className="text-xs text-slate-600 mt-1">Kamu berhasil menuntaskan <strong>{quiz.title}</strong> di Quiz Arena!</p>
            <div className="flex items-center justify-center gap-4 my-6">
              <div className="px-4 py-2.5 bg-amber-50 rounded-2xl border border-amber-200">
                <p className="text-[10px] font-bold text-slate-500">Skor Akhir</p>
                <p className="text-base font-black text-amber-700">{score} Poin</p>
              </div>
              <div className="px-4 py-2.5 bg-violet-50 rounded-2xl border border-violet-200">
                <p className="text-[10px] font-bold text-slate-500">Bonus XP</p>
                <p className="text-base font-black text-violet-700">+{quiz.xpReward} XP</p>
              </div>
              <div className="px-4 py-2.5 bg-sky-50 rounded-2xl border border-sky-200">
                <p className="text-[10px] font-bold text-slate-500">Bonus Gems</p>
                <p className="text-base font-black text-sky-700">+{quiz.gemReward}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={onBack} className="tactile-btn w-full py-3.5 px-6 bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-extrabold text-sm rounded-2xl border-b-[5px] border-indigo-900 shadow-md cursor-pointer">
                Coba Kuis Lain
              </button>
              <button onClick={() => navigate('/dashboard')} className="tactile-btn w-full py-3 px-6 bg-white text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 shadow-sm cursor-pointer">
                Kembali ke Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function BossBattle() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  if (!selectedQuiz) return React.createElement(QuizSelectionScreen, { onSelectQuiz: setSelectedQuiz });
  return React.createElement(QuizArena, { quiz: selectedQuiz, onBack: () => setSelectedQuiz(null) });
}