/* Assignment 1: Space Minesweeper
 * CSCI 4611, Spring 2024, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'
import { Mine } from './Mine';

export class App extends gfx.GfxApp
{
    // The graphics primitives that define objects in the scene 
    private ship: gfx.Mesh2;
    private star: gfx.Mesh2;
    private laser: gfx.Mesh2;
    private mine: gfx.Mesh2;

    // The stars will be drawn using a 2D particle system
    private starfield: gfx.Particles2;

    // These transforms are "groups" that are used to hold instances
    // of the same base object when they need to be placed in the scene
    // multiple times. They contain an array called .children that
    // you can iterate through to access all these objects.
    private lasers: gfx.Node2;
    private mines: gfx.Node2;

    // Member variable to store the current position of the mouse in
    // normalized device coordinates.
    private mousePosition: gfx.Vector2;

    // Member variable to record the last time a mine was spawned
    private timeSinceLastMineSpawn: number;

    // A sound effect to play when the ship shoots the laser
    private laserSound: HTMLAudioElement;

    // --- Create the App class ---
    constructor()
    {
        // initialize the base class gfx.GfxApp
        super();

        // Initialize all the member variables
        this.ship = gfx.Geometry2Factory.createBox();
        this.star = gfx.Geometry2Factory.createBox();
        this.laser = gfx.Geometry2Factory.createBox();
        this.mine = gfx.Geometry2Factory.createBox();

        this.starfield = new gfx.Particles2(this.star, 200);

        this.lasers = new gfx.Node2();
        this.mines = new gfx.Node2();

        this.mousePosition = new gfx.Vector2()

        this.timeSinceLastMineSpawn = 0;

        this.laserSound = new Audio('./laser.mp3');

        // This parameter zooms in on the scene to fit within the window.
        // Other options include FIT or STRETCH.
        this.renderer.viewport = gfx.Viewport.CROP;
    }


    // --- Initialize the graphics scene ---
    createScene(): void 
    {
        // Load the star texture to make the object a sprite
        this.star.material.texture = new gfx.Texture('./star.png');

        // Place each star randomly throughout the scene.  The Math.random() 
        // function is also used to make them vary in size.
        for(let i=0; i < this.starfield.numParticles; i++)
        {
            this.starfield.particleSizes[i] = Math.random()*0.008 + 0.002;
            this.starfield.particlePositions[i].set(Math.random()*2-1, Math.random()*2-1);
        }

        // Update the particle system position and sizes 
        this.starfield.update(true, true);

        // Set the laser to be a bright green color and scale the rectangle
        // so that it is in the shape of long, thin beam.
        this.laser.material.color.set(.247, .995, .284, 1);
        this.laser.scale.x = 0.01;
        this.laser.scale.y = 0.05;

        // Load the mine texture to make the object a sprite, then scale it 
        // to an appropriate size.
        this.mine.material.texture =  new gfx.Texture('./mine.png');
        this.mine.scale.set(0.12, 0.12);

        // When the geometry for the rectangle is created, the bounding circle
        // and bounding box is computed automatically.  However, sometimes it
        // is useful to scale them manually so that they provide a better
        // approximation for collision detection.  You don't need to modify
        // these values.
        this.mine.boundingCircle.radius *= .75;
        this.mine.boundingBox.min.multiplyScalar(0.5);
        this.mine.boundingBox.max.multiplyScalar(0.5);

        // Load the ship texture to make the object a sprite, then scale it 
        // to an appropriate size.
        this.ship.material.texture = new gfx.Texture('./ship.png');
        this.ship.scale.set(0.08, 0.08);

        // Add all the objects to the scene. Note that the order is important!
        // Objects that are added later will be rendered on top of objects
        // that are added first. This is most important for the stars; because
        // they are in the distant background, they should be added first.
        this.scene.add(this.starfield);
        this.scene.add(this.lasers);
        this.scene.add(this.mines);
        this.scene.add(this.ship);
    }

    
    // --- Update is called once each frame by the main graphics loop ---
    update(deltaTime: number): void 
    {
        // These parameters define the motions of objects in the scene,
        // which you will use to complete the code for this assignment.
        // You can feel free to modify them if you want your game
        // to have a different feel from the instructor's implementation.
        // Note that all speed variables are scaled by deltaTime.
        // This is important to make sure that the game plays similarly
        // on different devices regardless of the framerate.
        const moveDirection = gfx.Vector2.normalize(this.mousePosition);
        const shipSpeed = this.mousePosition.length() * deltaTime;
        const mineRotation = -40 * Math.PI / 180 * deltaTime;
        const mineSpeed = 0.1 * deltaTime;
        const laserSpeed = 2 * deltaTime;
        const mineSpawnInterval = .5;

        // Point the ship wherever the mouse cursor is located.
        // Note that this.mousePosition has already been converted to
        // normalized device coordinates.
        this.ship.lookAt(this.mousePosition);


        // PART 1: STAR MOVEMENT
        // In class, we will make the ship move in the direction of the mouse.
        // Here, you are going to make each star move in the opposite direction.
        // This creates the illusion that the ship is moving forward, even
        // though it remains in the center of the screen.
        for(let i=0; i < this.starfield.numParticles; i++)
        {
            const starPosition = this.starfield.particlePositions[i];


           // ADD YOUR CODE HERE


            // This code resets the position of the star if it has moved outside
            // the boundaries of the scene, which are between (-1, -1) and (1, 1).
            if(starPosition.x > 1)
                starPosition.x += -2;
            else if(starPosition.x < -1)
                starPosition.x += 2;

            if(starPosition.y > 1)
                starPosition.y += -2;
            else if(starPosition.y < -1)
                starPosition.y += 2;
        }

        // We need to call this method to update the starfield using the new star
        // positions defined above. The second parameter is false because the
        // sizes have not changed, so they do not need to be updated.
        this.starfield.update(true, false);


        // PART 2: MINE MOVEMENT
        // You will need to make each mine move in the direction opposite
        // to the ship, similar to the way you moved the stars.
        // Additionally, you should add some rotation to the mine so that
        // it gradually spins as it moves.
        this.mines.children.forEach((mine: gfx.Node2) => {

            
            // ADD YOUR CODE HERE


            // This code makes the mines "home" in on the ship position
            const mineToShip = gfx.Vector2.subtract(mine.position, this.ship.position);
            mineToShip.normalize();
            mineToShip.multiplyScalar(mineSpeed)
            mine.position.subtract(mineToShip);

            // Type cast the mine as a Mine object, and then call its update method.
            // This function checks to see whether the mine is currently exploding,
            // and if so, it updates the animation and eventually removes the mine
            // from the scene when the animation is complete.
            (mine as Mine).update(deltaTime);
        });


        // PART 4: LASER MOVEMENT
        // For each laser in the scene, translate it forward in its current direction.
        // If the laser moves outside the boundary of the scene, then delete it
        // from the scene by calling its remove() method.
        this.lasers.children.forEach((laser: gfx.Node2) => {
            

            // ADD YOUR CODE HERE


        });  

        // Check for mine-to-mine collisions
        this.checkForMineCollisions();

        // Check for laser-to-mine collisions
        this.checkForLaserCollisions();

        // Check to see if enough time has elapsed since the last
        // mine was spawned, and if so, then call the function
        // to spawn a new mine.
        this.timeSinceLastMineSpawn += deltaTime;
        if(this.timeSinceLastMineSpawn >= mineSpawnInterval)
        {
            this.spawnMine();
            this.timeSinceLastMineSpawn = 0;
        }
    }


    // PART 3: LASER SPAWNING
    // You should create a new instance of the laser using a ShapeInstance,
    // similar to the way other the objects are added to this scene.
    // Make sure that the new laser is pointing in the ship's current direction
    // and then add it to the this.lasers group.
    onMouseDown(event: MouseEvent): void 
    {
        
        // ADD YOUR CODE HERE

        // Play the laser sound effect
        // Setting the time to 0 restarts playback at the beginning 
        // This is necessary if the user presses the button rapidly
        this.laserSound.play();
        this.laserSound.currentTime = 0;

    }

    
    // When the mouse moves, store the current position of the mouse.
    // The MouseEvent object reports mouse information in screen coordinates.
    // We need to convert them to normalized device coordinates so that
    // they are in the same reference frame as the objects in our scene.
    onMouseMove(event: MouseEvent): void 
    {
        this.mousePosition.copy(this.getNormalizedDeviceCoordinates(event.x, event.y));
    }


    // This function creates a new mine.  In order to prevent infinite mines,
    // which would slow down the game, we limit the total number of mines.
    // If the number of mines exceeds the limit, we tell the oldest mine
    // to start its explosion animation.
    private spawnMine(): void
    {
        const mineSpawnDistance = 1.25;
        const mineLimit = 20;
        
        // This creates a new instance of the base mine object.
        // Note that the Mine class extends the ShapeInstance class,
        // so only the original object will be created in GPU memory.
        const mineInstance = new Mine(this.mine);
        this.mines.add(mineInstance);

        // Compute a random direction ahead of the ship and then translate
        // mine far enough away that it is outside the edge of the screen.
        const mineRotation = this.ship.rotation + (Math.random() * Math.PI / 3 - Math.PI / 6);
        const mineDirection = gfx.Vector2.rotate(gfx.Vector2.UP, mineRotation);
        mineInstance.position.add(gfx.Vector2.multiplyScalar(mineDirection, mineSpawnDistance))

        // If we are over the mine limit, make the oldest one explode!
        if(this.mines.children.length > mineLimit)
        {
            const firstMine = this.mines.children[0] as Mine;
            if(!firstMine.isExploding())
                firstMine.explode();
        }
    }


    // PART 5: MINE COLLISIONS
    // In this function, we need to loop through all the mines and then check each pair
    // to see if they are colliding.  You can the mine object's intersects() method
    // to accomplish this.  By default, this method will check their bounding circles,
    // which is fine for this case because it is the fastest method and it is a good
    // enough approximation.  If two mines are intersecting, make them both explode.
    private checkForMineCollisions(): void
    {
        for(let i=0; i < this.mines.children.length; i++)
        {
            for(let j=i+1; j < this.mines.children.length; j++)
            {
                // The mines group can contain any object that extend from the base
                // class (Transform2).  This code will explicitly cast each one
                // as a Mine object, which in this case is a safe thing to do.
                const mine1 = this.mines.children[i] as Mine;
                const mine2 = this.mines.children[j] as Mine;

                
                // ADD YOUR CODE HERE


            }
        }
    }


    // PART 6: LASER COLLISIONS
    // In this function, we need to loop through each laser and then check each mine 
    // to see if they are colliding.  The logic for this is similar to the mine-to-mine
    // collisions.  However, a bounding circle is not a good approximation for the 
    // rectangular laser, so in this case your intersects() method should pass in the
    // gfx.IntersectionMode2.AXIS_ALIGNED_BOUNDING_BOX parameter to check intersections
    // using axis-aligned bounding boxes.  This is less efficient than using a bounding
    // circle, but is still reasonably fast enough.  If the objects are colliding, then
    // make the mine explode and immediately remove the laser from the scene.
    private checkForLaserCollisions(): void
    {
        this.lasers.children.forEach((laser: gfx.Node2)=>{
            this.mines.children.forEach((mineElem: gfx.Node2)=>{

                // Type cast the element as a Mine object, as was done previously
                // in the mine collision function.
                const mine = mineElem as Mine;

                
                // ADD YOUR CODE HERE

                
            });
        });
    }
}