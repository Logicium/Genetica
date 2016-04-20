/**
 * Created by Kisora on 2015-10-27.
 */

$(document).ready(function () {
    var GA = new GeneticAlgorithm();
});

var GeneticAlgorithm = function GeneticAlgorithm(){
    runGeneticAlgorithm();
};

var genomeDomain = ['0','1','2','3','4','5','6','7','8','9','+','-','*','/'];
var chromosomeLength = 5;
var crossoverRate = .7;
var mutationRate = .001;
var randomNumber = function(range){ return Math.floor(Math.random() * range) };
var populationPoolSize = 40;
var generationNumber = 0;
var currentPopulationPool = [];
var nextPopulationPool = [];
var perfectFitness = 42;

function runGeneticAlgorithm(){

    generateUniqueChromosomes();
}

function generateUniqueChromosomes(){
    for(var i = 0; i < populationPoolSize; i++){
        currentPopulationPool.push(new Chromosome());
    }

    while(true) {
        // Clear the new pool
        nextPopulationPool =[];

        // Add to the generations
        generationNumber++;

        // Loop until the pool has been processed
        for(var x = currentPopulationPool.length-1; x>=0 ; x-=2) {
            // Select two members
            var mateA = selectMember(currentPopulationPool);
            var mateB = selectMember(currentPopulationPool);

            // Cross over and mutate
            mateA.crossOver(mateB);
            mateA.mutate();
            mateB.mutate();

            // Rescore the nodes
            mateA.assignFitnessScore();
            mateB.assignFitnessScore();

            // Check to see if either is the solution
            if (mateA.evaluatedChromosomeTotal == perfectFitness && mateA.isValid()) {
               console.log("Generations: " + generationNumber + "  Solution: " + mateA.decodeChromosome());
                return;
            }
            if (mateB.evaluatedChromosomeTotal == perfectFitness && mateB.isValid()) {
                console.log("Generations: " + generationNumber + "  Solution: " + mateB.decodeChromosome());
                return;
            }

            // Add to the new pool
            nextPopulationPool.push(mateA);
            nextPopulationPool.push(mateB);
        }

        // Add the newPool back to the old pool
        currentPopulationPool = currentPopulationPool.concat(nextPopulationPool);
    }

}

function selectMember(population) {

    // Get the total fitness
    var totalFitness = 0.0;
    for (var x = population.length-1; x>=0 ; x--) {
        var individualScore = population[x].fitnessScore;
        totalFitness += individualScore;
    }
    var slice = totalFitness * Math.random();

    // Loop to find the node
    var ttot = 0.0;
    for (var x = population.length-1 ; x>=0 ; x--) {
        var node = population[x];
        ttot += node.fitnessScore;
        if (ttot >= slice) { population.remove(x); return node; }
    }

    return population.splice( population.indexOf(population.length-1), 1 );
}

var evaluatedChromosomeTotal;
var fitnessScore;

this.evaluatedChromosomeTotal = function(){ return evaluatedChromosomeTotal; };
this.fitnessScore  = function(){return fitnessScore;};


var Chromosome = function Chromosome(){
    var encodedChromosomeBits = [];
    var decodedChromosomeGenomes = [];

    createChromosome();

    function createChromosome(){
        for(var i=0;i<chromosomeLength;i++){
            var position = encodedChromosomeBits.length;
            var binaryGenome = decimalToBinary(randomNumber(genomeDomain.length));
            console.log("Binary Genome: "+binaryGenome);
            var fillLength = 4 - binaryGenome.length;
            for (var x=0; x<fillLength; x++) encodedChromosomeBits.push(0);
            encodedChromosomeBits.push(binaryGenome);
        }
        assignFitnessScore();

        function decimalToBinary(dec){
            return Number(dec).toString(2);
        }
    }

    function assignFitnessScore(){
        evaluatedChromosomeTotal = evaluateChromosomeGenome();
        if (evaluatedChromosomeTotal == perfectFitness){ fitnessScore = 0; }
        fitnessScore = 1 / (perfectFitness - evaluatedChromosomeTotal);
        console.log("Fitness Score:" +fitnessScore);

        function evaluateChromosomeGenome(){
            var decodedChromosome = decodeChromosome();
            return eval(decodedChromosome);
        }
    }

    this.decodeChromosome = function(){
        decodeChromosome();
    };

    function decodeChromosome(){
        for(var i=0;i<encodedChromosomeBits.length;i++){
            var index = parseInt(encodedChromosomeBits.slice(i,i+4), 2);
            if (index < genomeDomain.length) decodedChromosomeGenomes.push(genomeDomain[index]);
        }
        return decodedChromosomeGenomes;
    }

    function crossOver(other) {

        // Should we cross over?
        if (Math.random() > crossoverRate) return;

        // Generate a random position
        var pos = Math.ceil(Math.random(encodedChromosomeBits.length));

        // Swap all chars after that position
        for (var x=pos;x<encodedChromosomeBits.length();x++) {
            // Get our character
            var tmp = encodedChromosomeBits.charAt(x);

            // Swap the chars
            encodedChromosomeBits.setCharAt(x, other.encodedChromosomeBits.charAt(x));
            other.encodedChromosomeBits.setCharAt(x, tmp);
        }
    }

    // Mutation
    function mutate() {
        for (var x=0;x<chromo.length();x++) {
            if (rand.nextDouble()<=mutRate)
                chromo.setCharAt(x, (chromo.charAt(x)=='0' ? '1' : '0'));
        }
    }


    function isValid() {

        // Decode our chromo
        var decodedString = decodeChromo();

        var num = true;
        for (var x=0;x<decodedString.length();x++) {
            var ch = decodedString.charAt(x);

            // Did we follow the num-oper-num-oper-num patter
            if (num == !Character.isDigit(ch)) return false;

            // Don't allow divide by zero
            if (x>0 && ch=='0' && decodedString.charAt(x-1)=='/') return false;

            num = !num;
        }

        // Can't end in an operator
        if (!Character.isDigit(decodedString.charAt(decodedString.length()-1))) return false;

        return true;
    }

};















