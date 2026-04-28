'use client';

import { use, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Column = {
  id: string;
  title: string;
  board_id: string;
  order_index: number;
};

type Card = {
  id: string;
  column_id: string;
  title: string;
  description: string;
  order_index: number;
};

function SortableCard({
  card,
  editingCardId,
  editTitle,
  editDescription,
  setEditTitle,
  setEditDescription,
  handleStartEdit,
  handleSaveEdit,
  handleCancelEdit,
  handleDeleteCard,
}: {
  card: Card;
  editingCardId: string | null;
  editTitle: string;
  editDescription: string;
  setEditTitle: React.Dispatch<React.SetStateAction<string>>;
  setEditDescription: React.Dispatch<React.SetStateAction<string>>;
  handleStartEdit: (card: Card) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  handleDeleteCard: (cardId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    disabled: editingCardId === card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  if (editingCardId === card.id) {
    return (
      <div className="rounded-2xl border border-indigo-200 bg-white p-3 shadow-md">
        <input
          className="mb-2 w-full rounded-xl border border-slate-200 p-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Kart başlığı"
        />

        <textarea
          className="mb-2 w-full rounded-xl border border-slate-200 p-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Açıklama"
        />

        <div className="flex gap-2">
          <button
            onClick={handleSaveEdit}
            className="flex-1 rounded-xl bg-emerald-600 p-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Kaydet
          </button>

          <button
            onClick={handleCancelEdit}
            className="flex-1 rounded-xl bg-slate-200 p-2 text-sm font-medium text-slate-700 transition hover:bg-slate-300"
          >
            İptal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onDoubleClick={() => handleStartEdit(card)}
      className={`cursor-move rounded-2xl border bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md ${
        isDragging
          ? 'scale-105 border-indigo-400 bg-indigo-50 shadow-2xl ring-2 ring-indigo-300'
          : 'border-slate-200'
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-800">{card.title}</h3>

        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteCard(card.id);
          }}
          className="rounded-full px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-red-50 hover:text-red-600"
        >
          Sil
        </button>
      </div>

      {card.description && (
        <p className="mt-1 text-sm leading-5 text-slate-600">
          {card.description}
        </p>
      )}

      <p className="mt-3 text-xs text-slate-400">Çift tıkla: düzenle</p>
    </div>
  );
}

function DroppableColumn({
  column,
  cards,
  cardInputs,
  setCardInputs,
  handleAddCard,
  handleDeleteColumn,
  handleDeleteCard,
  editingCardId,
  editTitle,
  editDescription,
  setEditTitle,
  setEditDescription,
  handleStartEdit,
  handleSaveEdit,
  handleCancelEdit,
}: {
  column: Column;
  cards: Card[];
  cardInputs: Record<string, { title: string; description: string }>;
  setCardInputs: React.Dispatch<
    React.SetStateAction<Record<string, { title: string; description: string }>>
  >;
  handleAddCard: (columnId: string) => void;
  handleDeleteColumn: (columnId: string) => void;
  handleDeleteCard: (cardId: string) => void;
  editingCardId: string | null;
  editTitle: string;
  editDescription: string;
  setEditTitle: React.Dispatch<React.SetStateAction<string>>;
  setEditDescription: React.Dispatch<React.SetStateAction<string>>;
  handleStartEdit: (card: Card) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
  });

  return (
    <div className="min-w-[300px] rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-800">{column.title}</h2>
          <span className="mt-1 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            {cards.length} kart
          </span>
        </div>

        <button
          onClick={() => handleDeleteColumn(column.id)}
          className="rounded-full px-3 py-1 text-xs font-semibold text-slate-400 transition hover:bg-red-50 hover:text-red-600"
        >
          Kolonu Sil
        </button>
      </div>

      <SortableContext
        items={cards.map((card) => card.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`mb-4 min-h-[160px] space-y-3 rounded-2xl border border-dashed p-3 transition-all duration-200 ${
            isOver
              ? 'border-indigo-400 bg-indigo-50 shadow-inner ring-2 ring-indigo-100'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          {cards.length === 0 ? (
            <div className="flex min-h-[110px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/60 text-center text-sm text-slate-400">
              Kart yok. Buraya kart ekleyebilir veya sürükleyebilirsin.
            </div>
          ) : (
            cards.map((card) => (
              <SortableCard
                key={card.id}
                card={card}
                editingCardId={editingCardId}
                editTitle={editTitle}
                editDescription={editDescription}
                setEditTitle={setEditTitle}
                setEditDescription={setEditDescription}
                handleStartEdit={handleStartEdit}
                handleSaveEdit={handleSaveEdit}
                handleCancelEdit={handleCancelEdit}
                handleDeleteCard={handleDeleteCard}
              />
            ))
          )}
        </div>
      </SortableContext>

      <div className="space-y-2 border-t border-slate-100 pt-3">
        <input
          className="w-full rounded-xl border border-slate-200 bg-white p-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Kart başlığı"
          value={cardInputs[column.id]?.title ?? ''}
          onChange={(e) =>
            setCardInputs({
              ...cardInputs,
              [column.id]: {
                title: e.target.value,
                description: cardInputs[column.id]?.description ?? '',
              },
            })
          }
        />

        <textarea
          className="w-full rounded-xl border border-slate-200 bg-white p-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Açıklama"
          value={cardInputs[column.id]?.description ?? ''}
          onChange={(e) =>
            setCardInputs({
              ...cardInputs,
              [column.id]: {
                title: cardInputs[column.id]?.title ?? '',
                description: e.target.value,
              },
            })
          }
        />

        <button
          onClick={() => handleAddCard(column.id)}
          className="w-full rounded-xl bg-indigo-600 p-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
        >
          Kart Ekle
        </button>
      </div>
    </div>
  );
}

export default function BoardDetail({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = use(params);

  const [boardTitle, setBoardTitle] = useState('');
  const [columns, setColumns] = useState<Column[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [columnTitle, setColumnTitle] = useState('');
  const [cardInputs, setCardInputs] = useState<
    Record<string, { title: string; description: string }>
  >({});

  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const fetchColumnsAndCards = async () => {
    const { data: boardData, error: boardError } = await supabase
      .from('boards')
      .select('title')
      .eq('id', boardId)
      .single();

    if (boardError) {
      alert(boardError.message);
      return;
    }

    if (boardData) {
      setBoardTitle(boardData.title);
    }

    const { data: columnData, error: columnError } = await supabase
      .from('columns')
      .select('*')
      .eq('board_id', boardId)
      .order('order_index', { ascending: true });

    if (columnError) {
      alert(columnError.message);
      return;
    }

    setColumns(columnData ?? []);

    const columnIds = columnData?.map((column) => column.id) ?? [];

    if (columnIds.length === 0) {
      setCards([]);
      return;
    }

    const { data: cardData, error: cardError } = await supabase
      .from('cards')
      .select('*')
      .in('column_id', columnIds)
      .order('order_index', { ascending: true });

    if (cardError) {
      alert(cardError.message);
      return;
    }

    setCards(cardData ?? []);
  };

  useEffect(() => {
    fetchColumnsAndCards();
  }, []);

  const handleAddColumn = async () => {
    if (!columnTitle.trim()) return;

    const { data, error } = await supabase
      .from('columns')
      .insert([
        {
          title: columnTitle,
          board_id: boardId,
          order_index: columns.length,
        },
      ])
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    if (data) {
      setColumns([...columns, data]);
      setColumnTitle('');
    }
  };

  const handleAddCard = async (columnId: string) => {
    const input = cardInputs[columnId];

    if (!input?.title?.trim()) return;

    const currentColumnCards = cards.filter(
      (card) => card.column_id === columnId
    );

    const { data, error } = await supabase
      .from('cards')
      .insert([
        {
          title: input.title,
          description: input.description,
          column_id: columnId,
          order_index: currentColumnCards.length,
        },
      ])
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    if (data) {
      setCards([...cards, data]);
      setCardInputs({
        ...cardInputs,
        [columnId]: { title: '', description: '' },
      });
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    const confirmed = confirm('Bu kartı silmek istediğine emin misin?');

    if (!confirmed) return;

    const { error } = await supabase.from('cards').delete().eq('id', cardId);

    if (error) {
      alert(error.message);
      return;
    }

    setCards(cards.filter((card) => card.id !== cardId));
  };

  const handleDeleteColumn = async (columnId: string) => {
    const confirmed = confirm(
      'Bu kolonu silmek istediğine emin misin? İçindeki kartlar da silinecek.'
    );

    if (!confirmed) return;

    const { error } = await supabase.from('columns').delete().eq('id', columnId);

    if (error) {
      alert(error.message);
      return;
    }

    setColumns(columns.filter((column) => column.id !== columnId));
    setCards(cards.filter((card) => card.column_id !== columnId));
  };

  const handleStartEdit = (card: Card) => {
    setEditingCardId(card.id);
    setEditTitle(card.title);
    setEditDescription(card.description || '');
  };

  const handleCancelEdit = () => {
    setEditingCardId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleSaveEdit = async () => {
    if (!editingCardId) return;

    if (!editTitle.trim()) {
      alert('Kart başlığı boş olamaz.');
      return;
    }

    const { error } = await supabase
      .from('cards')
      .update({
        title: editTitle,
        description: editDescription,
      })
      .eq('id', editingCardId);

    if (error) {
      alert(error.message);
      return;
    }

    setCards(
      cards.map((card) =>
        card.id === editingCardId
          ? { ...card, title: editTitle, description: editDescription }
          : card
      )
    );

    handleCancelEdit();
  };

  const saveCardOrder = async (updatedCards: Card[]) => {
    const updates = updatedCards.map((card) =>
      supabase
        .from('cards')
        .update({
          column_id: card.column_id,
          order_index: card.order_index,
        })
        .eq('id', card.id)
    );

    const results = await Promise.all(updates);
    const hasError = results.find((result) => result.error);

    if (hasError?.error) {
      alert(hasError.error.message);
      fetchColumnsAndCards();
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    if (editingCardId) return;

    const { active, over } = event;

    if (!over) return;

    const activeCardId = active.id as string;
    const overId = over.id as string;

    const activeCard = cards.find((card) => card.id === activeCardId);

    if (!activeCard) return;

    const sourceColumnId = activeCard.column_id;

    let targetColumnId = sourceColumnId;
    let targetIndex = 0;

    if (overId.startsWith('column-')) {
      targetColumnId = overId.replace('column-', '');
      targetIndex = cards.filter((card) => card.column_id === targetColumnId)
        .length;
    } else {
      const overCard = cards.find((card) => card.id === overId);

      if (!overCard) return;

      targetColumnId = overCard.column_id;

      const targetColumnCards = cards
        .filter((card) => card.column_id === targetColumnId)
        .sort((a, b) => a.order_index - b.order_index);

      targetIndex = targetColumnCards.findIndex((card) => card.id === overId);
    }

    if (sourceColumnId === targetColumnId) {
      const columnCards = cards
        .filter((card) => card.column_id === sourceColumnId)
        .sort((a, b) => a.order_index - b.order_index);

      const oldIndex = columnCards.findIndex((card) => card.id === activeCardId);

      if (oldIndex === targetIndex) return;

      const reorderedCards = arrayMove(columnCards, oldIndex, targetIndex).map(
        (card, index) => ({
          ...card,
          order_index: index,
        })
      );

      const otherCards = cards.filter(
        (card) => card.column_id !== sourceColumnId
      );

      const newCards = [...otherCards, ...reorderedCards];

      setCards(newCards);
      await saveCardOrder(reorderedCards);

      return;
    }

    const sourceCards = cards
      .filter(
        (card) => card.column_id === sourceColumnId && card.id !== activeCardId
      )
      .sort((a, b) => a.order_index - b.order_index)
      .map((card, index) => ({
        ...card,
        order_index: index,
      }));

    const targetCards = cards
      .filter((card) => card.column_id === targetColumnId)
      .sort((a, b) => a.order_index - b.order_index);

    const movedCard: Card = {
      ...activeCard,
      column_id: targetColumnId,
    };

    const newTargetCards = [
      ...targetCards.slice(0, targetIndex),
      movedCard,
      ...targetCards.slice(targetIndex),
    ].map((card, index) => ({
      ...card,
      order_index: index,
    }));

    const untouchedCards = cards.filter(
      (card) =>
        card.column_id !== sourceColumnId &&
        card.column_id !== targetColumnId &&
        card.id !== activeCardId
    );

    const newCards = [...untouchedCards, ...sourceCards, ...newTargetCards];

    setCards(newCards);
    await saveCardOrder([...sourceCards, ...newTargetCards]);
  };

  const totalCards = cards.length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-200 p-6 text-slate-900">
      <div className="mb-8 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-600">
              TaskFlow Board
            </p>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              {boardTitle || 'Yükleniyor...'}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Kartları sürükleyerek sıralayabilir veya farklı kolonlara taşıyabilirsin.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-2xl bg-indigo-600 px-4 py-3 text-white shadow-sm">
              <p className="text-xs opacity-80">Kolon</p>
              <p className="text-xl font-bold">{columns.length}</p>
            </div>

            <div className="rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-sm">
              <p className="text-xs opacity-80">Kart</p>
              <p className="text-xl font-bold">{totalCards}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-2 rounded-3xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur sm:flex-row">
        <input
          className="flex-1 rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Yeni kolon adı"
          value={columnTitle}
          onChange={(e) => setColumnTitle(e.target.value)}
        />

        <button
          onClick={handleAddColumn}
          className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
        >
          Kolon Ekle
        </button>
      </div>

      {columns.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-indigo-300 bg-white/70 p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">
            Henüz kolon eklenmedi
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Başlamak için örneğin “To Do”, “In Progress” ve “Done” kolonlarını ekleyebilirsin.
          </p>
        </div>
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((column) => (
              <DroppableColumn
                key={column.id}
                column={column}
                cards={cards
                  .filter((card) => card.column_id === column.id)
                  .sort((a, b) => a.order_index - b.order_index)}
                cardInputs={cardInputs}
                setCardInputs={setCardInputs}
                handleAddCard={handleAddCard}
                handleDeleteColumn={handleDeleteColumn}
                handleDeleteCard={handleDeleteCard}
                editingCardId={editingCardId}
                editTitle={editTitle}
                editDescription={editDescription}
                setEditTitle={setEditTitle}
                setEditDescription={setEditDescription}
                handleStartEdit={handleStartEdit}
                handleSaveEdit={handleSaveEdit}
                handleCancelEdit={handleCancelEdit}
              />
            ))}
          </div>
        </DndContext>
      )}
    </main>
  );
}