import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DataRow {
  id: number;
  data: string;
  mes?: string;
  ano?: number;
  tipo: string;
  descricao: string;
  valor: number;
  categoria?: 'Essencial' | 'Desejo' | 'Poupança';
  [key: string]: any;
}

interface DataTableProps {
  data: DataRow[];
  onDataChange: (newData: DataRow[]) => void;
}

export const DataTable = ({ data, onDataChange }: DataTableProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Partial<DataRow>>({});
  const [isAdding, setIsAdding] = useState(false);

  const startEdit = (row: DataRow) => {
    setEditingId(row.id);
    setEditingData({ ...row });
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingData({
      data: new Date().toLocaleDateString('pt-BR'),
      mes: new Date().toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase(),
      ano: new Date().getFullYear(),
      tipo: 'Despesa',
      descricao: '',
      valor: 0,
    });
  };

  const saveEdit = () => {
    if (editingId !== null) {
      const updatedData = data.map(row =>
        row.id === editingId ? { ...row, ...editingData } : row
      );
      onDataChange(updatedData);
      setEditingId(null);
      setEditingData({});
      toast({
        title: "✅ Dados atualizados",
        description: "As alterações foram salvas com sucesso.",
      });
    }
  };

  const saveAdd = () => {
    const newId = Math.max(...data.map(row => row.id), 0) + 1;
    const newRow: DataRow = {
      id: newId,
      data: editingData.data || '',
      mes: editingData.mes || '',
      ano: editingData.ano || new Date().getFullYear(),
      tipo: editingData.tipo || 'Despesa',
      descricao: editingData.descricao || '',
      valor: editingData.valor || 0,
    };
    
    onDataChange([...data, newRow]);
    setIsAdding(false);
    setEditingData({});
    toast({
      title: "✅ Registro adicionado",
      description: "Nova transação foi inserida na planilha.",
    });
  };

  const deleteRow = (id: number) => {
    const updatedData = data.filter(row => row.id !== id);
    onDataChange(updatedData);
    toast({
      title: "🗑️ Registro removido",
      description: "A transação foi excluída da planilha.",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setEditingData({});
  };

  const getTypeBadgeVariant = (tipo: string) => {
    return tipo.toLowerCase().includes('receita') || tipo.toLowerCase().includes('entrada') 
      ? 'default' 
      : 'secondary';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-primary">Dados da Planilha</CardTitle>
        <Button onClick={startAdd} className="flex items-center gap-2" variant="default">
          <Plus className="h-4 w-4" />
          Adicionar Registro
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Mês</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria 50/30/20</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    {editingId === row.id ? (
                      <Input
                        value={editingData.data || ''}
                        onChange={(e) => setEditingData({...editingData, data: e.target.value})}
                        className="h-8"
                      />
                    ) : (
                      row.data
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === row.id ? (
                      <Input
                        value={editingData.mes || ''}
                        onChange={(e) => setEditingData({...editingData, mes: e.target.value})}
                        className="h-8"
                      />
                    ) : (
                      row.mes
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === row.id ? (
                      <Input
                        type="number"
                        value={editingData.ano || ''}
                        onChange={(e) => setEditingData({...editingData, ano: parseInt(e.target.value)})}
                        className="h-8"
                      />
                    ) : (
                      row.ano
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === row.id ? (
                      <Select
                        value={editingData.tipo || ''}
                        onValueChange={(value) => setEditingData({...editingData, tipo: value})}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Receita">Receita</SelectItem>
                          <SelectItem value="Entrada">Entrada</SelectItem>
                          <SelectItem value="Despesa">Despesa</SelectItem>
                          <SelectItem value="Saída">Saída</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={getTypeBadgeVariant(row.tipo)}>
                        {row.tipo}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === row.id ? (
                      <Input
                        value={editingData.descricao || ''}
                        onChange={(e) => setEditingData({...editingData, descricao: e.target.value})}
                        className="h-8"
                      />
                    ) : (
                      row.descricao
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === row.id ? (
                      <Select
                        value={editingData.categoria || ''}
                        onValueChange={(value) => setEditingData({...editingData, categoria: value as 'Essencial' | 'Desejo' | 'Poupança'})}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Essencial">💡 Essencial</SelectItem>
                          <SelectItem value="Desejo">❤️ Desejo</SelectItem>
                          <SelectItem value="Poupança">🐷 Poupança</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      row.categoria ? (
                        <Badge variant="outline" className="text-xs">
                          {row.categoria === 'Essencial' && '💡'}
                          {row.categoria === 'Desejo' && '❤️'}
                          {row.categoria === 'Poupança' && '🐷'}
                          {' '}{row.categoria}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )
                    )}
                  </TableCell>
                  <TableCell className={`font-medium ${
                    (row.tipo.toLowerCase().includes('receita') || row.tipo.toLowerCase().includes('entrada'))
                      ? 'text-success' 
                      : 'text-danger'
                  }`}>
                    {editingId === row.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editingData.valor || ''}
                        onChange={(e) => setEditingData({...editingData, valor: parseFloat(e.target.value) || 0})}
                        className="h-8"
                      />
                    ) : (
                      formatCurrency(row.valor)
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      {editingId === row.id ? (
                        <>
                          <Button size="sm" variant="ghost" onClick={saveEdit}>
                            <Save className="h-4 w-4 text-success" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEdit}>
                            <X className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => startEdit(row)}>
                            <Pencil className="h-4 w-4 text-info" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteRow(row.id)}>
                            <Trash2 className="h-4 w-4 text-danger" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {isAdding && (
                <TableRow>
                  <TableCell>
                    <Input
                      value={editingData.data || ''}
                      onChange={(e) => setEditingData({...editingData, data: e.target.value})}
                      className="h-8"
                      placeholder="dd/mm/aaaa"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editingData.mes || ''}
                      onChange={(e) => setEditingData({...editingData, mes: e.target.value})}
                      className="h-8"
                      placeholder="JAN"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={editingData.ano || ''}
                      onChange={(e) => setEditingData({...editingData, ano: parseInt(e.target.value)})}
                      className="h-8"
                      placeholder="2025"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={editingData.tipo || ''}
                      onValueChange={(value) => setEditingData({...editingData, tipo: value})}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Receita">Receita</SelectItem>
                        <SelectItem value="Entrada">Entrada</SelectItem>
                        <SelectItem value="Despesa">Despesa</SelectItem>
                        <SelectItem value="Saída">Saída</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editingData.descricao || ''}
                      onChange={(e) => setEditingData({...editingData, descricao: e.target.value})}
                      className="h-8"
                      placeholder="Descrição da transação"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={editingData.categoria || ''}
                      onValueChange={(value) => setEditingData({...editingData, categoria: value as 'Essencial' | 'Desejo' | 'Poupança'})}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Essencial">💡 Essencial</SelectItem>
                        <SelectItem value="Desejo">❤️ Desejo</SelectItem>
                        <SelectItem value="Poupança">🐷 Poupança</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingData.valor || ''}
                      onChange={(e) => setEditingData({...editingData, valor: parseFloat(e.target.value) || 0})}
                      className="h-8"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button size="sm" variant="ghost" onClick={saveAdd}>
                        <Save className="h-4 w-4 text-success" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit}>
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};