
function choseOne(stars) {
    let random_box = []
    for (let star of stars) {
        const {id ,grade } = star;
        random_box = random_box.concat(multiply(id,grade))
    }
    let length = random_box.length
   var id = Math.floor(Math.random()*length)
   id = random_box[id]
   for (let star of stars) {
       if (star.id == id) {
           return star
           break
       }
   }
   return {}
}

const multiply = (id,grade) => {
    let box = []
    while (grade--) {
        box.push(id)
    }
    return box
}



module.exports = {
    choseOne
}






