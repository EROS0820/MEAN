const sharp = require('sharp');
const uuidv4 = require('uuid/v4');
const path = require('path');

class Resize {

    constructor(folder) {
        this.folder = folder;
    }

    async save(buffer) {
        const filename = Resize.filename();
        const filepath = this.filepath(filename);

        await sharp(buffer)
            .resize(700, 300, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .toFile(filepath);
        // if don't need image resize
        // await sharp(buffer).toFile(filepath);
        return filename;
    }

    static filename() {
        return `${uuidv4()}.png`;
    }

    filepath(filename) {
        return path.resolve(`${this.folder}/${filename}`);
    }
}
module.exports = Resize;