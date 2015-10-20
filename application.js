var Game = React.createClass({
  getInitialState: function () {
    return {
      gameOver: false,
      gameWon: false,
      board: new Minesweeper.Board(25, 40)
    };
  },

  updateGame: function (position, revealed) {
    var tile = this.state.board.grid[position[0]][position[1]];
    if (revealed) {
      tile.explore();
    }else {
      tile.toggleFlag();
    }

    this.gameCheck();
  },

  gameCheck: function () {
    if (this.state.board.won()) {
      this.setState({gameWon: true});
    }else if (this.state.board.lost()) {
      this.setState({gameOver: true});
    }else {
      // trigger a re-render
      this.setState({gameWon: false});
    }
  },

  gameEndRender: function (boardRend, gameMessage) {
    return(
      <div class='game-end'>
        {boardRend}
        <div id='modal'>
          <h3 className='game-message'>{gameMessage}</h3>
          <a className='replay' href="#">Re-sweep?</a>
        </div>
      </div>
    );
  },

  // put game end div outside of minesweep game,
  // and just make display block at end of game
  // so change class using react

  render: function () {
    var boardRend = <Board board={this.state.board} updateGame={this.updateGame} />;
    if (this.state.gameWon) {
      return this.gameEndRender(boardRend, "Congradulations, you won!");
      // var gameWonRender = this.gameEndRender(boardRend, "Congradulations, you won!");
      // React.render(gameWonRender, document.body);
    } else if (this.state.gameOver) {
      return this.gameEndRender(boardRend, "Whoops, I think you lost...");
      // var gameOverRender = this.gameEndRender(boardRend, "Whoops, I think you lost...");
      // React.render(gameOverRender, document.body);
    } else {
      return boardRend;
    }
  }
});

var Board = React.createClass({
  render: function () {
    var self = this;
    return(
      <div>
        {
          this.props.board.grid.map(function (row, rowIdx) {
            return(
              <div className="row" key={rowIdx}>
                {row.map(function (tile, tileIdx){
                  return(
                    <Tile
                    tileObj={self.props.board.grid[rowIdx][tileIdx]}
                    pos={[rowIdx, tileIdx]}
                    updateGame={self.props.updateGame}
                    key={tileIdx}
                    />
                  );
                })}
              </div>
            );
          }
        )}
      </div>
    );

  }
});

var Tile = React.createClass({
  handleClick: function () {
    event.preventDefault();
    // boolean is whether its being revealed (true) or flagged (false)
    this.props.updateGame(this.props.pos, true);
  },

  handleContextMenu: function () {
    event.preventDefault();

    // boolean is whether its being revealed (true) or flagged (false)
    this.props.updateGame(this.props.pos, false);
  },

  render: function () {
    var tileText = "";
    var tileClass = "tile";
    var tile = this.props.tileObj;

    if (tile.explored === true) {
      tileClass += " revealed";
      if (tile.bombed === true) {
        tileText = "\u2622";
        tileClass += " bombed";
      } else if (tile.adjacentBombCount() > 0) {
        tileText = tile.adjacentBombCount();
      }

    }else if (tile.flagged === true) {
      tileText = "\u2691";
      tileClass += " flagged";
    }

    return(
        <div
          className={tileClass}
          onContextMenu={this.handleContextMenu}
          onClick={this.handleClick}>
          {tileText}
        </div>
    );
  }
});

React.render(<Game  />, document.getElementById('minesweeper-game'));
