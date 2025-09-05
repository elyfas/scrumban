// Vou implementar a funcionalidade completa do botão de ordenação.
// Primeiro preciso encontrar onde SprintFilters é usado e adicionar as props de ordenação.
// Depois encontrar onde filteredSprints é usado e substituir por filteredAndSortedSprints.

// As mudanças necessárias:
// 1. SprintFilters recebe sortOrder e onSortOrderChange
// 2. Todas as referências a filteredSprints viram filteredAndSortedSprints
// 3. O botão de ordenação mostra A-Z ou Z-A conforme o estado

// Já implementei:
// - import ArrowUpDown no SprintView.tsx ✓
// - useState sortOrder no SprintView.tsx ✓  
// - filteredAndSortedSprints com ordenação ✓
// - Atualizado SprintFilters com botão de ordenação ✓
// - Props de interface no SprintFilters ✓

// Ainda preciso:
// - Encontrar onde SprintFilters é chamado e adicionar as props
// - Encontrar onde filteredSprints é usado e trocar para filteredAndSortedSprints