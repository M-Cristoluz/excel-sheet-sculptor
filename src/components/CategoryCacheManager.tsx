import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Database, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const CategoryCacheManager = () => {
  const [cacheSize, setCacheSize] = useState(0);
  const [cacheEntries, setCacheEntries] = useState<[string, string][]>([]);

  const loadCache = () => {
    const cacheKey = 'educash-ai-categories-cache';
    const cache: Record<string, string> = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    const entries = Object.entries(cache);
    setCacheSize(entries.length);
    setCacheEntries(entries);
  };

  useEffect(() => {
    loadCache();
  }, []);

  const clearCache = () => {
    localStorage.removeItem('educash-ai-categories-cache');
    setCacheSize(0);
    setCacheEntries([]);
    toast({
      title: "🗑️ Cache limpo",
      description: "Todas as categorizações em cache foram removidas.",
    });
  };

  const getCategoryBadgeVariant = (categoria: string) => {
    if (categoria === 'Essencial') return 'default';
    if (categoria === 'Desejo') return 'secondary';
    if (categoria === 'Poupança') return 'outline';
    return 'default';
  };

  const getCategoryEmoji = (categoria: string) => {
    if (categoria === 'Essencial') return '💡';
    if (categoria === 'Desejo') return '❤️';
    if (categoria === 'Poupança') return '🐷';
    return '📝';
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle>Cache de Categorizações IA</CardTitle>
          </div>
          <Badge variant="outline" className="text-sm">
            {cacheSize} {cacheSize === 1 ? 'entrada' : 'entradas'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          O cache armazena categorizações anteriores para acelerar futuros uploads e economizar requisições à API.
        </p>

        {cacheSize > 0 ? (
          <>
            <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-3 bg-muted/20">
              {cacheEntries.slice(0, 10).map(([descricao, categoria], index) => (
                <div key={index} className="flex items-center justify-between text-sm py-1">
                  <span className="text-foreground truncate flex-1">{descricao}</span>
                  <Badge variant={getCategoryBadgeVariant(categoria)} className="ml-2">
                    {getCategoryEmoji(categoria)} {categoria}
                  </Badge>
                </div>
              ))}
              {cacheSize > 10 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  ... e mais {cacheSize - 10} {cacheSize - 10 === 1 ? 'entrada' : 'entradas'}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadCache}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Limpar Cache
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar limpeza do cache</AlertDialogTitle>
                    <AlertDialogDescription>
                      Isso removerá todas as {cacheSize} categorizações armazenadas. 
                      Despesas com descrições repetidas precisarão ser categorizadas novamente pela IA.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={clearCache}>
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma categorização em cache ainda</p>
            <p className="text-xs mt-1">Importe uma planilha para começar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
