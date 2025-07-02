import Board from './components/Board';
import Toolbar from './components/Toolbar';
import Toolbox from './components/Toolbox';
import  BoardProvider  from './store/BoardProvier';
import ToolBoxProvider from './store/ToolBoxProvider';
function App() {

  return(
    <>
    <BoardProvider>
      <ToolBoxProvider>
    <Toolbar />
    <Board />
    <Toolbox />
    </ToolBoxProvider>
    </BoardProvider>

    </>

  ) ;

}

export default App;
