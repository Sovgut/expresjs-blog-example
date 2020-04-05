const { database } = require('../../database');

exports.findAll = (request, response) => {
    const posts = [...database];
    if (posts && posts.length > 0) {
        return response.status(200).json(posts);
    }

    return response.status(404).send();
}

exports.findOne = (request, response) => {
    const { postId } = request.params;
    if (isNaN(Number(postId))) {
        return response.status(400).send();
    }

    const post = database.find(post => post.id === Number(postId));
    if (post) {
        return response.status(200).json(post);
    }

    return response.status(404).send();
}

exports.create = (request, response) => {
    const { title, desc } = request.body;
    if (!title || !desc) {
        return response.status(400).send();
    }

    const latestId = database.reduce((acc, post) => post.id > acc ? post.id : acc, 0);
    const post = { id: latestId + 1, title, desc };
    database.push(post);

    return response.status(201).json(post);
}

exports.destroy = (request, response) => {
    const { postId } = request.params;
    if (isNaN(Number(postId))) {
        return response.statu(400).send();
    }

    const index = database.findIndex(post => post.id === Number(postId));
    const post = database.splice(index, 1);
    if (post) {
        return response.status(200).json(post);
    }

    return response.status(404).send();
}

exports.update = (request, response) => {
    const { postId } = request.params;
    const { title, desc } = request.body;
    if (isNaN(Number(postId)) || !title || !desc) {
        console.log(postId, title, desc);
        return response.status(400).send();
    }

    const index = database.findIndex(post => post.id === Number(postId));
    database[index] = { ...database[index], title, desc };

    return response.status(200).send();
}
