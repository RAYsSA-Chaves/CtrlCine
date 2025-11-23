// Centralizando requisição para API externa para pegar média de nota para novos filmes cadastrados

export async function buscarNotaFilme(titulo) {
    try {
        const apiKey = 'd8956b0c7a7757f8f504b6b0c43c194e';
        const query = encodeURIComponent(titulo);

        // busca não exata
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${query}`;

        const response = await fetch(url);
        const data = await response.json();

        // se não achar nada, retorna 3
        if (!data.results || data.results.length === 0) {
            return 3;
        }

        // pega o primeiro resultado da busca
        const filme = data.results[0];

        // TMDb retorna vote_average entre 0 e 10
        const nota10 = filme.vote_average;

        // converter para 1 a 5
        const nota5 = Math.round(nota10 / 2);

        console.log('Nota encontrada: ', nota5)
        return nota5;

    } catch (error) {
        console.error('Erro ao buscar nota no TMDb:', error);
        return 3;
    }
}
