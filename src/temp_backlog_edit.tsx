// Código completo do BacklogView com ícones de ação após Story Points

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