import { mockMovements } from '../data/mockMovements.js';
import { useLocalStorage } from './useLocalStorage.js';

const MOVEMENTS_KEY = 'contfia.movements.v1';

export function useMovements() {
  const [movements, setMovements] = useLocalStorage(MOVEMENTS_KEY, mockMovements);

  function addMovement(movement) {
    setMovements([{ ...movement, id: movement.id || `movement-${Date.now()}` }, ...movements]);
  }

  function getMovement(movementId) {
    return movements.find((movement) => movement.id === movementId) || null;
  }

  return {
    movements,
    addMovement,
    getMovement,
  };
}
