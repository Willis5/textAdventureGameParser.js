(function(root, undefined) {
  // Create temporary Array of item names - is this a stupid way to do it?
  let itemNameStore = [];

  for (var item in objectStore.items) {
        itemNameStore.push(objectStore.items[item].name);
  };

  var textParser = {
    // It needs to store string after it's turned into array
    stringArray: [],
    stringObjectArray: [],

    //command words - needs expanding
    commandWords: ["north", "east", "south", "west", "up", "down", "n", "e", "s", "w", "u", "d", "examine", 
    "look", "open", "inventory", "i", "use", "combine", "get", "take", "drop", "pick up", "eli", "help", "save", "load"],
    // It needs to store filler words - to remove - needs expanding
    fillerWords: ["a", "and", "are", "as", "at", "go", "it", "or", "the", "then", "to", "with"],
    
    // Helper Functions
    // Function to remove filler words defined in 'fillerWords'.
    removeFillerWords: function(stringArray) {
      let filtered = stringArray.filter(function(stringArrayWord) {
        if ((this.fillerWords.indexOf(stringArrayWord)) === -1) {
          return true;
        }
      }, this);
      return filtered;
    },
    
    // Function to remove empty Strings.
    removeEmptyStrings: function(stringArray) {
      let filtered = stringArray.filter(function(word) {
        if (word !== "") {
          return true;
        }
      });
      return filtered;
    },
    
    // Function to concantinate words that make up an item name.
    conCatItemNames: function(stringArray) {
      let indexesToDelete = [];
      
      // First find matches and change to conCat Version - store index of second concat word to delete after
      let parsedArray = stringArray.map(function(word, index) {
      let conCatWord = stringArray[index] + " " + stringArray[index + 1];
        
        if (itemNameStore.indexOf(conCatWord) > -1) {
          // store index of next item which needs to be deleted
          indexesToDelete.push(index + 1);
          return conCatWord;
        } else {
          return word;
        }
      });
      // Remove items that have been concantinated
      // Iterate backwards though array to delete words following concantinated.
      for (let i = indexesToDelete.length - 1; i >= 0; i--) {
        parsedArray.splice(indexesToDelete[i], 1)
      }
      return parsedArray;
    },
    
    // Main Text Parsing function
    parseText: function(inputString) {
      let stringArray = this.stringArray;
      
      // Prepare string for parsing
      // inputString to lowercase
      inputString = inputString.toLowerCase();
      // remove punctuation
      inputString = inputString.replace(/[.,\/#!?<>$%\^&\*;:{}=\-_`~()\"\']/g, "");
      // turn into array
      stringArray = inputString.split(" ");
      // remove filler words
      stringArray = this.removeFillerWords(stringArray);
      // remove empty strings
      stringArray = this.removeEmptyStrings(stringArray);
      // Find items names that are more than one word
      stringArray = this.conCatItemNames(stringArray);
      // Catagorise words
      
      this.stringObjectArray = stringArray.map(function(string) {
        // Turn items into their correspnding object
        for (var cItem in objectStore.items) {
          if (itemNameStore.indexOf(string) !== -1) {
            if (string === objectStore.items[cItem].name) {
              return objectStore.items[cItem];
            }
          }
        }
        // Find Command Words
        if (this.commandWords.indexOf(string) !== -1) {
          return { string: string, wordCatagory: "command"};
        }
        // Desigate all other words 'uncatagorized
        return { string: string, wordCatagory: "uncatagorized"};
      }, this);
      // console.log(this.stringObjectArray);
      return this.stringObjectArray;
    }
  };
  
  window.textParser = textParser;

})(this)
