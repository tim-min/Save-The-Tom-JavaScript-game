class Player {
    constructor(x, y) {
        this.settings = {
            x: x,
            y: y,
            sprite_id: 0,
            turn: 0
        }
        this.sprite_source = ['sprites/player/character_malePerson_cheer0.png', 'sprites/player/character_malePerson_cheer1.png'];
        this.sprites = [new Image(), new Image()];

        this.die_sprites_source = ['sprites/player/character_malePerson_behindBack.png',
                                   'sprites/player/character_malePerson_duck.png',
                                   'sprites/player/character_malePerson_down.png'];
        this.die_sprites = [new Image(), new Image(), new Image()];
        
        for (x = 0; x < this.sprites.length; x++) {
            this.sprites[x].src = this.sprite_source[x]
        }
        for (x = 0; x < this.die_sprites.length; x++) {
            this.die_sprites[x].src = this.die_sprites_source[x]
        }
    }

    StayAnim() {
        if (this.settings.sprite_id < 1) {
            this.settings.sprite_id ++;
        } else {
            this.settings.sprite_id = 0;
        }
    }

    Move() {
        if (this.settings.turn == 0) {
            this.settings.x = 40;
        } else {
            this.settings.x = 110;
        }
    }
}

class Enemy {
    constructor(x, y, speed) {
        this.settings = {
            x: x,
            y: y,
            speed: speed,
        }
        this.sprite = new Image();
        this.sprite.src = 'sprites/dec/crateWood.png';

        this.score = 0;
    }

    Move() {
        if (this.settings.y < 250) {
            this.settings.y += this.settings.speed;
        }else {
            let x = Math.floor(Math.random() * 2);
            if (x == 0) {
                this.settings.x = 40;
            }else {
                this.settings.x = 110;
            }
            this.settings.y = 0;
            this.score += 1;
            this.settings.speed += 0.05;
        }
    }
}


class Game {
    constructor(cvs_el, context) {
        this.cvs = document.querySelector(cvs_el);
        this.ctx = this.cvs.getContext(context);
        this.player = new Player(40, 200);
        this.enemy = new Enemy(110, 0, 0.5);
        this.end = false;
        this.main_image = new Image();
        this.main_image.src = 'sprites/dec/main_dec.png';
    }

    EndAnim(ctx, player, main_image, score) {
        ctx.drawImage(main_image, 0, 0);
        ctx.drawImage(player.die_sprites[0], player.settings.x, player.settings.y, 60, 100);
        setTimeout(function(){
            ctx.drawImage(main_image, 0, 0);
            ctx.drawImage(player.die_sprites[1], player.settings.x, player.settings.y, 60, 100);
            setTimeout(function(){
                ctx.drawImage(main_image, 0, 0);
                ctx.drawImage(player.die_sprites[2], player.settings.x, player.settings.y, 60, 100);
                
                ctx.fillStyle = 'white';
                ctx.font = "30px Impact";
                ctx.fillText(`Your score:`, 10, 100);
                ctx.fillText(String(score), 90, 150);

                document.querySelector('#PlAgain').style.visibility = 'visible';
            }, 400);
        }, 400);
    }

    Collision() {
        if (this.player.settings.x == this.enemy.settings.x && this.player.settings.y - 11 < this.enemy.settings.y + 11) {
            this.enemy.settings.y = 0;
            this.enemy.settings.x = 110;
            this.enemy.settings.speed = 0.5;
            this.end = true;
            this.EndAnim(this.ctx, this.player, this.main_image, this.enemy.score);
            this.enemy.score = 0;
        }
    }

    Draw() {
        // drawing background
        // this.ctx.fillStyle = 'white';
        // this.ctx.fillRect(0, 0, 200, 500);
        this.ctx.drawImage(this.main_image, 0, 0);


        // drawing player
        // this.ctx.fillStyle = 'green';
        // this.ctx.fillRect(this.player.settings.x, 150, 50, 50);

        this.ctx.drawImage(this.player.sprites[this.player.settings.sprite_id], this.player.settings.x, this.player.settings.y, 60, 100);

        // drawing enemy square
        // this.ctx.fillStyle = 'red';
        // this.ctx.fillRect(this.enemy.settings.x, this.enemy.settings.y, 50, 50);

        this.ctx.drawImage(this.enemy.sprite, this.enemy.settings.x, this.enemy.settings.y);
        
        // showing score
        this.ctx.fillStyle = 'white';
        this.ctx.font = "40px Impact";
        this.ctx.fillText(String(this.enemy.score), 10, 40);

        this.Collision();
    }
}


window.onload = function() {
    let game = new Game('#canvas', '2d');
    $('#PlayerLeft').on('click', function () {
        game.player.settings.turn = 0;
    }); 
    $('#PlayerRight').on('click', function () {
        game.player.settings.turn = 1;
    }); 
    $('#PlAgain').on('click', function () {
        document.querySelector('#PlAgain').style.visibility = 'hidden';
        game.end = false;
    }); 
    setInterval(function(){
        if (!game.end) {
            game.enemy.Move();
            game.Draw();
            game.player.Move();
        }
    }, 10)

    setInterval(function(){
        game.player.StayAnim();
    }, 300);
}
