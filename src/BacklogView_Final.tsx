// Parte final do arquivo que precisa ser adicionada após a linha do cursor

                      onClick={() => handleCardEdit(card)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-500 font-mono">#{card.cardNumber}</span>
                            
                            {card.issueType === 'story' && <span className="text-sm">📖</span>}
                            {card.issueType === 'bug' && <span className="text-sm">🐛</span>}
                            {card.issueType === 'task' && <span className="text-sm">✓</span>}
                            {card.issueType === 'epic' && <span className="text-sm">⚡</span>}
                            
                            <div className={`w-2 h-2 rounded-full ${
                              card.priority === 'critical' ? 'bg-red-500' :
                              card.priority === 'high' ? 'bg-orange-500' :
                              card.priority === 'medium' ? 'bg-yellow-500' :
                              'bg-gray-400'
                            }`}></div>
                          </div>
                          
                          <h3 className="font-medium text-gray-900 line-clamp-2">{card.title}</h3>
                          
                          {card.description && (
                            <p className="text-sm text-gray-600 line-clamp-1 mt-1">{card.description}</p>
                          )}
                          
                          {card.labels && card.labels.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {card.labels.slice(0, 3).map((label, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {label}
                                </Badge>
                              ))}
                              {card.labels.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{card.labels.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Responsável */}
                    <div className="text-center">
                      <span className="text-sm text-gray-700">
                        {card.assignee || 'Não atribuído'}
                      </span>
                    </div>
                    
                    {/* Story Points */}
                    <div className="text-center">
                      {card.storyPoints ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {card.storyPoints}
                        </Badge>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </div>
                    
                    {/* Ações */}
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSingleCardAction('edit', card.id);
                        }}
                        className="p-1 h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="Editar"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSingleCardAction('archive', card.id);
                        }}
                        className="p-1 h-7 w-7 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        title="Arquivar"
                      >
                        <Archive className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Tem certeza que deseja excluir esta história? Esta ação não pode ser desfeita.')) {
                            handleSingleCardAction('delete', card.id);
                          }
                        }}
                        className="p-1 h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Excluir"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <CreateCardDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleCreateCard}
        initialStatus="backlog"
      />

      <CardDetailsPanel
        card={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        onSave={(updatedCard) => {
          setAllCards(prev => prev.map(card => 
            card.id === updatedCard.id ? updatedCard : card
          ));
          setSelectedCard(null);
          toast.success('Card atualizado com sucesso!');
        }}
      />

      {/* Move validation alert */}
      <AlertDialog 
        open={moveValidationAlert.open} 
        onOpenChange={(open) => setMoveValidationAlert(prev => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{moveValidationAlert.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {moveValidationAlert.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Entendi</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}