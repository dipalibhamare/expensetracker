import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  note: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  expenses: Expense[] = [];

  categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Health', 'Education', 'Other'];

  title = '';
  amount: number | null = null;
  category = 'Food';
  date = this.today();
  note = '';

  searchText = '';
  filterCategory = 'All';
  filterDate = '';

  editingId: number | null = null;

  ngOnInit(): void {
    this.loadExpenses();
  }

  get filteredExpenses(): Expense[] {
    const search = this.searchText.trim().toLowerCase();

    return this.expenses
      .filter(expense => {
        const matchesSearch =
          !search ||
          expense.title.toLowerCase().includes(search) ||
          expense.category.toLowerCase().includes(search) ||
          expense.note.toLowerCase().includes(search);

        const matchesCategory =
          this.filterCategory === 'All' || expense.category === this.filterCategory;

        const matchesDate =
          !this.filterDate || expense.date === this.filterDate;

        return matchesSearch && matchesCategory && matchesDate;
      })
      .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  }

  get totalExpenses(): number {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  get visibleTotal(): number {
    return this.filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  }

  get categoryTotals(): { category: string; total: number; percentage: number }[] {
    const totals = this.categories
      .map(category => ({
        category,
        total: this.expenses
          .filter(expense => expense.category === category)
          .reduce((sum, expense) => sum + expense.amount, 0)
      }))
      .filter(item => item.total > 0);

    return totals.map(item => ({
      ...item,
      percentage: this.totalExpenses ? (item.total / this.totalExpenses) * 100 : 0
    })).sort((a, b) => b.total - a.total);
  }

  get averageExpense(): number {
    return this.expenses.length ? this.totalExpenses / this.expenses.length : 0;
  }

  addOrUpdateExpense(): void {
    if (!this.title.trim() || this.amount === null || this.amount <= 0 || !this.date) {
      return;
    }

    const expense: Expense = {
      id: this.editingId ?? Date.now(),
      title: this.title.trim(),
      amount: Number(this.amount),
      category: this.category,
      date: this.date,
      note: this.note.trim()
    };

    if (this.editingId !== null) {
      const index = this.expenses.findIndex(item => item.id === this.editingId);
      if (index !== -1) {
        this.expenses[index] = expense;
      }
    } else {
      this.expenses.push(expense);
    }

    this.saveExpenses();
    this.resetForm();
  }

  editExpense(expense: Expense): void {
    this.editingId = expense.id;
    this.title = expense.title;
    this.amount = expense.amount;
    this.category = expense.category;
    this.date = expense.date;
    this.note = expense.note;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteExpense(id: number): void {
    this.expenses = this.expenses.filter(expense => expense.id !== id);
    this.saveExpenses();

    if (this.editingId === id) {
      this.resetForm();
    }
  }

  clearAll(): void {
    if (this.expenses.length === 0) {
      return;
    }

    if (window.confirm('Delete all expenses?')) {
      this.expenses = [];
      this.saveExpenses();
      this.resetForm();
    }
  }

  resetForm(): void {
    this.editingId = null;
    this.title = '';
    this.amount = null;
    this.category = 'Food';
    this.date = this.today();
    this.note = '';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }

  private saveExpenses(): void {
    localStorage.setItem('expense-tracker-expenses', JSON.stringify(this.expenses));
  }

  private loadExpenses(): void {
    const saved = localStorage.getItem('expense-tracker-expenses');

    if (!saved) {
      return;
    }

    try {
      const parsed: unknown = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        this.expenses = parsed as Expense[];
      }
    } catch {
      this.expenses = [];
    }
  }

  private today(): string {
    return new Date().toISOString().split('T')[0];
  }
}