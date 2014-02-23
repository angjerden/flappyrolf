// Initialize Phaser, and creates a 400x490px game
var game_width = 600;
var game = new Phaser.Game(game_width, 490, Phaser.AUTO, 'game_div');
var game_state = {};

// Creates a new 'main' state that wil contain the game
game_state.main = function() { };  
game_state.main.prototype = {

    preload: function() { 
		// Function called first to load all the assets
		// Change the background color of the game
		this.game.stage.backgroundColor = '#71c5cf';
		//Load the bird sprite
		this.game.load.image('bird', 'assets/rolf.png');
		this.game.load.image('pipe', 'assets/didgeridoo2.png');
		this.game.load.image('pipe-flipped', 'assets/didgeridoo2-flipped.png');
    },

    create: function() { 
    	// Fuction called after 'preload' to setup the game    
		// Display the bird on the screen
		this.bird = this.game.add.sprite(100, 245, 'bird');

		this.pipes = game.add.group();
		this.pipes.createMultiple(20, 'pipe');

		this.pipes_flipped = game.add.group();
		this.pipes_flipped.createMultiple(20, 'pipe-flipped');

		this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);

		// Add gravity to the bird to make it fall
		this.bird.body.gravity.y = 1000;

		// Call the 'jump' function when the spacebar is hit
		var spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spacebar.onDown.add(this.jump, this);

		this.score = 0;
		var style = { font: "30px Arial", fill: "#ffffff"};
		this.label_score = this.game.add.text(20, 20, this.score.toString(), style);
    },
    
    update: function() {
		// Function called 60 times per second
		// If the bird is out of the world, call the 'restart_game' function
		if (this.bird.inWorld == false) {
			this.restart_game();
		}

		this.game.physics.overlap(this.bird, this.pipes, this.restart_game, null, this);
		this.game.physics.overlap(this.bird, this.pipes_flipped, this.restart_game, null, this);
    },

    // Make the bird jump
    jump: function() {
		// Add a vertical velocity to the bird
		this.bird.body.velocity.y = -350;
	},

	// Restart the game
	restart_game: function() {
		// Start the 'main' state, which restarts the game
		this.game.time.events.remove(this.timer);
		this.game.state.start('main');
    },

    add_one_pipe: function(x, y) {
		// Get the first dead pipe of our group
		var pipe = this.pipes.getFirstDead();

		// Set the position of the new pipe
		pipe.reset(x, y);

		// Add velocity to the pipe to make it move left
		pipe.body.velocity.x = -200;

		// Kill the pipe when it's no longer visible
		pipe.outOfBoundsKill = true;
    },

	add_one_pipe_flipped: function(x, y) {
		// Get the first dead pipe of our group
		var pipe = this.pipes_flipped.getFirstDead();

		// Set the position of the new pipe
		pipe.reset(x, y);

		// Add velocity to the pipe to make it move left
		pipe.body.velocity.x = -200;

		// Kill the pipe when it's no longer visible
		pipe.outOfBoundsKill = true;
	},

    add_row_of_pipes: function() {
		var hole = Math.floor(Math.random()*5)+1;
		console.log("hole: " + hole);
		var upper_pipe_y_origin = -400;
		var hole_offset = hole * 70;
		var upper_pipe_y = upper_pipe_y_origin + hole_offset;
		var lower_pipe_offset = 520;
		var lower_pipe_y = upper_pipe_y + lower_pipe_offset;

		/*for (var i = 0; i < 8; i++) {
			if (i != hole && i != hole + 1) {
				this.add_one_pipe(game_width, i*60+10);
			}
		}*/
		this.add_one_pipe(game_width, upper_pipe_y);
		this.add_one_pipe_flipped(game_width, lower_pipe_y);
		this.score += 1;
		this.label_score.content = this.score;
    }

};

// Add and start the 'main' state to start the game
game.state.add('main', game_state.main);  
game.state.start('main'); 
