import React, { useState, useRef, useEffect } from "react";
import { BookMarked, Plus, Upload, Download, Play, X, ChevronLeft, ChevronRight, Shuffle, RotateCcw, Trash2 } from "lucide-react";
import jsPDF from "jspdf";

/**
 * Flashcards — Apple × Swiss blend
 * - Create and manage flashcard decks
 * - Bulk import from CSV
 * - Export to PDF for studying
 * - Self-testing mode with flip animation
 * - Progress tracking
 * - Dark mode support
 * - EN/粵 bilingual support
 */

const TRANSLATIONS = {
  EN: {
    title: "Flashcards",
    subtitle: "Study smarter with interactive flashcards",
    createDeck: "Create New Deck",
    deckName: "Deck name...",
    create: "Create",
    cards: "cards",
    mastered: "mastered",
    study: "Study",
    front: "Front (Question)...",
    back: "Back (Answer)...",
    addCard: "Add Card",
    latest: "Latest:",
    question: "Question",
    answer: "Answer"
  },
  粵: {
    title: "記憶卡",
    subtitle: "用互動記憶卡更聰明咁溫習",
    createDeck: "建立新卡組",
    deckName: "卡組名稱...",
    create: "建立",
    cards: "張卡",
    mastered: "已掌握",
    study: "開始溫習",
    front: "正面（問題）...",
    back: "背面（答案）...",
    addCard: "新增卡片",
    latest: "最新：",
    question: "問題",
    answer: "答案"
  }
} as const;

type Flashcard = {
  id: string;
  front: string;
  back: string;
  mastered: boolean;
};

type Deck = {
  id: string;
  name: string;
  cards: Flashcard[];
};

// Flashcard Component
function Card({ 
  card, 
  isFlipped, 
  onFlip 
}: { 
  card: Flashcard; 
  isFlipped: boolean; 
  onFlip: () => void;
}) {
  return (
    <div 
      onClick={onFlip}
      className="relative w-full aspect-[3/2] cursor-pointer perspective-1000"
      style={{ perspective: '1000px' }}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ 
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 backface-hidden bg-white dark:bg-[#1C1C1E] rounded-2xl border-2 border-[#0A84FF] p-8 flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-center">
            <div className="text-xs uppercase tracking-wider font-semibold text-[#0A84FF] mb-4">
              Question
            </div>
            <p className="text-2xl font-semibold text-[#1D1D1F] dark:text-white leading-tight">
              {card.front}
            </p>
          </div>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 backface-hidden bg-[#0A84FF] rounded-2xl p-8 flex items-center justify-center"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="text-center">
            <div className="text-xs uppercase tracking-wider font-semibold text-white/70 mb-4">
              Answer
            </div>
            <p className="text-2xl font-semibold text-white leading-tight">
              {card.back}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Study Mode Component
function StudyMode({ 
  deck, 
  onClose,
  onUpdateDeck
}: { 
  deck: Deck; 
  onClose: () => void;
  onUpdateDeck: (updatedDeck: Deck) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [cards, setCards] = useState(deck.cards);
  const [masteredCount, setMasteredCount] = useState(deck.cards.filter(c => c.mastered).length);

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShuffled(true);
  };

  const markMastered = (mastered: boolean) => {
    const updated = [...cards];
    updated[currentIndex] = { ...updated[currentIndex], mastered };
    setCards(updated);
    setMasteredCount(updated.filter(c => c.mastered).length);
    
    // Save back to parent deck immediately
    onUpdateDeck({ ...deck, cards: updated });
  };

  const reset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCards(deck.cards);
    setMasteredCount(deck.cards.filter(c => c.mastered).length);
    setShuffled(false);
  };

  const handleClose = () => {
    // Save final state before closing
    onUpdateDeck({ ...deck, cards });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
      <div className="bg-white dark:bg-[#0B0B0D] rounded-3xl shadow-2xl w-full max-w-3xl animate-scaleIn">
        {/* Header */}
        <div className="px-8 py-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-white">{deck.name}</h3>
            <p className="text-sm text-[#86868B] dark:text-white/60 mt-1">
              Card {currentIndex + 1} of {cards.length} • {masteredCount} mastered
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all duration-150 hover:rotate-90"
            aria-label="Close"
          >
            <X size={24} className="text-[#86868B] dark:text-white/60" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-black/5 dark:bg-white/5">
          <div 
            className="h-full bg-[#0A84FF] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Card */}
        <div className="p-12">
          <Card card={currentCard} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} />
          
          <div className="text-center mt-6 text-sm text-[#86868B] dark:text-white/60">
            Click card to flip
          </div>
        </div>

        {/* Controls */}
        <div className="px-8 py-6 border-t border-black/10 dark:border-white/10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <button
              onClick={prevCard}
              disabled={currentIndex === 0}
              className="p-3 bg-[#F5F5F7] dark:bg-[#1C1C1E] rounded-xl hover:bg-[#E8E8ED] dark:hover:bg-[#2C2C2E] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
              aria-label="Previous card"
            >
              <ChevronLeft size={20} className="text-[#1D1D1F] dark:text-white" />
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => markMastered(false)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-150 ${
                  currentCard.mastered === false
                    ? 'bg-[#FF375F] text-white'
                    : 'bg-[#F5F5F7] dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-white hover:bg-[#E8E8ED] dark:hover:bg-[#2C2C2E]'
                }`}
              >
                Need Review
              </button>
              <button
                onClick={() => markMastered(true)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-150 ${
                  currentCard.mastered === true
                    ? 'bg-[#30D158] text-white'
                    : 'bg-[#F5F5F7] dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-white hover:bg-[#E8E8ED] dark:hover:bg-[#2C2C2E]'
                }`}
              >
                Mastered
              </button>
            </div>

            <button
              onClick={nextCard}
              disabled={currentIndex === cards.length - 1}
              className="p-3 bg-[#F5F5F7] dark:bg-[#1C1C1E] rounded-xl hover:bg-[#E8E8ED] dark:hover:bg-[#2C2C2E] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
              aria-label="Next card"
            >
              <ChevronRight size={20} className="text-[#1D1D1F] dark:text-white" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={shuffleCards}
              className="flex-1 px-4 py-2.5 bg-[#F5F5F7] dark:bg-[#1C1C1E] rounded-lg hover:bg-[#E8E8ED] dark:hover:bg-[#2C2C2E] text-sm font-medium text-[#1D1D1F] dark:text-white transition-all duration-150 flex items-center justify-center gap-2"
            >
              <Shuffle size={16} />
              Shuffle
            </button>
            <button
              onClick={reset}
              className="flex-1 px-4 py-2.5 bg-[#F5F5F7] dark:bg-[#1C1C1E] rounded-lg hover:bg-[#E8E8ED] dark:hover:bg-[#2C2C2E] text-sm font-medium text-[#1D1D1F] dark:text-white transition-all duration-150 flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function Flashcards({ theme, lang: propLang, onClose }: { theme: string; lang: string; onClose: () => void }) {
  // Use language from prop
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];

  const [isClosing, setIsClosing] = useState(false);
  
  // Load decks from localStorage on mount
  const loadDecks = (): Deck[] => {
    try {
      const saved = localStorage.getItem('flashcards_decks');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load decks:', error);
    }
    // Default sample deck
    return [
      {
        id: "1",
        name: "Sample Deck",
        cards: [
          { id: "1", front: "What is React?", back: "A JavaScript library for building user interfaces", mastered: false },
          { id: "2", front: "What is TypeScript?", back: "A typed superset of JavaScript", mastered: false },
        ]
      }
    ];
  };

  const [decks, setDecks] = useState<Deck[]>(loadDecks);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [studyMode, setStudyMode] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save decks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('flashcards_decks', JSON.stringify(decks));
    } catch (error) {
      console.error('Failed to save decks:', error);
    }
  }, [decks]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const createDeck = () => {
    if (newDeckName.trim()) {
      setDecks([...decks, {
        id: Date.now().toString(),
        name: newDeckName.trim(),
        cards: []
      }]);
      setNewDeckName("");
    }
  };

  const addCard = (deckId: string) => {
    if (newCardFront.trim() && newCardBack.trim()) {
      setDecks(decks.map(d => 
        d.id === deckId 
          ? { ...d, cards: [...d.cards, {
              id: Date.now().toString(),
              front: newCardFront.trim(),
              back: newCardBack.trim(),
              mastered: false
            }]}
          : d
      ));
      setNewCardFront("");
      setNewCardBack("");
    }
  };

  const updateDeck = (updatedDeck: Deck) => {
    setDecks(decks.map(d => d.id === updatedDeck.id ? updatedDeck : d));
  };

  const deleteDeck = (deckId: string) => {
    setDecks(decks.filter(d => d.id !== deckId));
  };

  const importCSV = (deckId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      const newCards: Flashcard[] = lines.map((line, index) => {
        const [front, back] = line.split(',').map(s => s.trim());
        return {
          id: `${Date.now()}-${index}`,
          front: front || '',
          back: back || '',
          mastered: false
        };
      }).filter(card => card.front && card.back);

      setDecks(decks.map(d => 
        d.id === deckId 
          ? { ...d, cards: [...d.cards, ...newCards] }
          : d
      ));
    };
    reader.readAsText(file);
  };

  const exportPDF = (deck: Deck) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPos = margin;

    // Title
    pdf.setFontSize(24);
    pdf.setTextColor(10, 132, 255); // #0A84FF
    pdf.text(deck.name, margin, yPos);
    yPos += 12;

    // Subtitle
    pdf.setFontSize(11);
    pdf.setTextColor(134, 134, 139); // #86868B
    pdf.text(`${deck.cards.length} flashcards`, margin, yPos);
    yPos += 20;

    // Cards
    deck.cards.forEach((card, index) => {
      // Calculate card height
      const questionLines = pdf.splitTextToSize(card.front, maxWidth - 20);
      const answerLines = pdf.splitTextToSize(card.back, maxWidth - 26);
      const cardHeight = 25 + (questionLines.length * 7) + (answerLines.length * 6) + 20;

      // Check if we need a new page
      if (yPos + cardHeight > pageHeight - 30) {
        pdf.addPage();
        yPos = margin;
      }

      const cardStartY = yPos;

      // Card border box
      pdf.setDrawColor(229, 229, 231); // #E5E5E7
      pdf.setLineWidth(0.8);
      pdf.roundedRect(margin, cardStartY, maxWidth, cardHeight, 3, 3);

      yPos = cardStartY + 10;

      // Card number label
      pdf.setFontSize(9);
      pdf.setTextColor(134, 134, 139);
      pdf.text(`CARD ${index + 1}`, margin + 8, yPos);
      yPos += 10;

      // Question text
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(29, 29, 31); // #1D1D1F
      pdf.text(questionLines, margin + 8, yPos);
      yPos += (questionLines.length * 7) + 8;

      // Answer label
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(134, 134, 139);
      pdf.text('ANSWER', margin + 8, yPos);
      yPos += 7;

      // Answer background box
      pdf.setFillColor(245, 245, 247); // #F5F5F7
      const answerBoxHeight = (answerLines.length * 6) + 10;
      pdf.roundedRect(margin + 8, yPos - 5, maxWidth - 16, answerBoxHeight, 2, 2, 'F');
      
      // Answer text
      pdf.setFontSize(12);
      pdf.setTextColor(58, 58, 60); // #3A3A3C
      pdf.text(answerLines, margin + 13, yPos + 2);
      
      yPos = cardStartY + cardHeight + 12;
    });

    // Footer on last page
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(134, 134, 139);
    const footerText = `Generated by BA14 Flashcards • ${new Date().toLocaleDateString()}`;
    const footerWidth = pdf.getTextWidth(footerText);
    const footerY = pageHeight - 15;
    pdf.text(footerText, (pageWidth - footerWidth) / 2, footerY);

    // Save the PDF
    pdf.save(`${deck.name.replace(/[^a-z0-9]/gi, '_')}_flashcards.pdf`);
  };

  if (studyMode && selectedDeck) {
    return <StudyMode deck={selectedDeck} onClose={() => setStudyMode(false)} onUpdateDeck={updateDeck} />;
  }

  return (
    <div 
      className={`fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 ${
        isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white dark:bg-[#0B0B0D] rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden ${
          isClosing ? 'animate-scaleOut' : 'animate-scaleIn'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/80 dark:bg-[#0B0B0D]/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-[#FFD60A]/10 dark:bg-[#FFD60A]/20 rounded-lg sm:rounded-xl flex-shrink-0">
              <BookMarked size={20} className="text-[#FFD60A] sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#1D1D1F] dark:text-white truncate">
                {t.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#86868B] dark:text-white/60 mt-0.5 truncate hidden sm:block">
                {t.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all duration-150 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30 flex-shrink-0"
            aria-label="Close"
          >
            <X size={20} className="text-[#86868B] dark:text-white/60 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-100px)]">
          {/* Create Deck */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold text-[#1D1D1F] dark:text-white mb-3 sm:mb-4">{t.createDeck}</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createDeck()}
                placeholder={t.deckName}
                className="flex-1 px-4 py-3 bg-[#F5F5F7] dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 rounded-xl text-[15px] text-[#1D1D1F] dark:text-white placeholder-[#86868B] dark:placeholder-white/40 outline-none focus:ring-2 focus:ring-[#FFD60A]/50 transition-all duration-150"
              />
              <button
                onClick={createDeck}
                disabled={!newDeckName.trim()}
                className="px-6 py-3 bg-[#FFD60A] text-[#1D1D1F] rounded-xl font-semibold hover:bg-[#FFD60A]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2"
              >
                <Plus size={18} />
                {t.create}
              </button>
            </div>
          </div>

          {/* Decks List */}
          <div className="space-y-4">
            {decks.map((deck) => (
              <div key={deck.id} className="bg-[#F5F5F7] dark:bg-[#1C1C1E] rounded-2xl p-6 border border-black/[0.06] dark:border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-[#1D1D1F] dark:text-white">{deck.name}</h4>
                    <p className="text-sm text-[#86868B] dark:text-white/60 mt-1">
                      {deck.cards.length} {t.cards} • {deck.cards.filter(c => c.mastered).length} {t.mastered}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={(e) => importCSV(deck.id, e)}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 bg-white dark:bg-[#2C2C2E] rounded-lg hover:bg-[#E8E8ED] dark:hover:bg-[#3A3A3C] transition-all duration-150"
                      title="Import CSV"
                    >
                      <Upload size={18} className="text-[#1D1D1F] dark:text-white" />
                    </button>
                    <button
                      onClick={() => exportPDF(deck)}
                      disabled={deck.cards.length === 0}
                      className="p-2.5 bg-white dark:bg-[#2C2C2E] rounded-lg hover:bg-[#E8E8ED] dark:hover:bg-[#3A3A3C] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
                      title="Export PDF"
                    >
                      <Download size={18} className="text-[#1D1D1F] dark:text-white" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete deck "${deck.name}"? This cannot be undone.`)) {
                          deleteDeck(deck.id);
                        }
                      }}
                      className="p-2.5 bg-white dark:bg-[#2C2C2E] rounded-lg hover:bg-[#FF375F]/10 dark:hover:bg-[#FF375F]/20 transition-all duration-150"
                      title="Delete Deck"
                    >
                      <Trash2 size={18} className="text-[#FF375F]" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDeck(deck);
                        setStudyMode(true);
                      }}
                      disabled={deck.cards.length === 0}
                      className="px-4 py-2.5 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2 font-semibold"
                    >
                      <Play size={16} />
                      {t.study}
                    </button>
                  </div>
                </div>

                {/* Add Card Form */}
                <div className="space-y-2 mb-4">
                  <input
                    type="text"
                    value={selectedDeck?.id === deck.id ? newCardFront : ""}
                    onChange={(e) => {
                      setSelectedDeck(deck);
                      setNewCardFront(e.target.value);
                    }}
                    placeholder={t.front}
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#2C2C2E] border border-black/10 dark:border-white/10 rounded-lg text-sm text-[#1D1D1F] dark:text-white placeholder-[#86868B] dark:placeholder-white/40 outline-none focus:ring-2 focus:ring-[#0A84FF]/50 transition-all duration-150"
                  />
                  <input
                    type="text"
                    value={selectedDeck?.id === deck.id ? newCardBack : ""}
                    onChange={(e) => {
                      setSelectedDeck(deck);
                      setNewCardBack(e.target.value);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && addCard(deck.id)}
                    placeholder={t.back}
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#2C2C2E] border border-black/10 dark:border-white/10 rounded-lg text-sm text-[#1D1D1F] dark:text-white placeholder-[#86868B] dark:placeholder-white/40 outline-none focus:ring-2 focus:ring-[#0A84FF]/50 transition-all duration-150"
                  />
                  <button
                    onClick={() => addCard(deck.id)}
                    disabled={!newCardFront.trim() || !newCardBack.trim() || selectedDeck?.id !== deck.id}
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#2C2C2E] border-2 border-dashed border-black/10 dark:border-white/10 rounded-lg text-sm font-medium text-[#1D1D1F] dark:text-white hover:bg-[#E8E8ED] dark:hover:bg-[#3A3A3C] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    {t.addCard}
                  </button>
                </div>

                {/* Cards Preview */}
                {deck.cards.length > 0 && (
                  <div className="text-xs text-[#86868B] dark:text-white/60">
                    {t.latest} {deck.cards[deck.cards.length - 1].front}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes scaleOut {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0.95); opacity: 0; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-fadeOut {
          animation: fadeOut 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-scaleOut {
          animation: scaleOut 0.2s cubic-bezier(0.4, 0, 1, 1);
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
