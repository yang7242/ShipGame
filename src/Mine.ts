/* Assignment 1: Space Minesweeper
 * CSCI 4611, Spring 2024, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'

export class Mine extends gfx.Mesh2
{
    private exploding: boolean;
    private explodeAlpha: number;

    constructor(mineMesh: gfx.Mesh2)
    {
        super();

        // Copy over all the mesh data from the mineMesh
        this.positionBuffer = mineMesh.positionBuffer;
        this.colorBuffer = mineMesh.colorBuffer;
        this.texCoordBuffer = mineMesh.texCoordBuffer;
        this.customBuffers = mineMesh.customBuffers;
        this.vertexCount = mineMesh.vertexCount;
        this.hasVertexColors = mineMesh.hasVertexColors;
        this.boundingBox = mineMesh.boundingBox;
        this.boundingCircle = mineMesh.boundingCircle;

        // Copy over the transform data
        this.position.copy(mineMesh.position);
        this.rotation = mineMesh.rotation;
        this.scale.copy(mineMesh.scale);
        this.layer = mineMesh.layer;

        // Copy over the material data
        this.material.copy(mineMesh.material);

        this.exploding = false;
        this.explodeAlpha = 0;
    }

    update(deltaTime: number)
    {
        const explodeTime = .25;

        if(this.exploding)
        {
            this.explodeAlpha += deltaTime / explodeTime;
            this.material.color.set(1, (1 - this.explodeAlpha), (1 - this.explodeAlpha), 1);

            if(this.explodeAlpha >= 1.0)
            {
                this.remove();
            }
        }
    }

    explode(): void
    {
        this.exploding = true;
    }

    isExploding(): boolean
    {
        return this.exploding;
    }
}