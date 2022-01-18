import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'
import { baseURL } from '../../config'
import PokemonList from '../components/PokemonList'
import { useEffect, useState } from 'react'
import Pagination from '../components/Pagination'

interface Props {
  response: any;
}

const Home: NextPage<Props> = ({ response }) => {
  const [pokemonsFullList, setPokemonsFullList] = useState([])
  const [page, setPage] = useState(1)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    if (response && response.results) {
      fetchPokemonData(response.results)
    }
  }, []);

  const fetchPokemonData = (response: any) => {
    const pokemonList: any = []
    Promise.all(response.map((pokemon: any) =>
      fetch(pokemon.url)
        .then(response => response.json())
        .then(function (resp) {
          pokemonList.push(resp)
        }).catch((error) => {
          console.log('error', error);
        })
    )).then(() => {
      setLoading(false);
      setPokemonsFullList(pokemonList);
    })
  }

  const handlePageChange = async (newPage: number) => {
    setPage(newPage)
    setLoading(true);

    let offset = '0';
    if (newPage > 1) {
      offset = ((newPage - 1) * 16).toString();
    }

    const res = await fetch(`${baseURL}/?limit=16&offset=${offset}`)
    const pokemons = await res.json()
    if (pokemons && pokemons.results) {
      fetchPokemonData(pokemons.results)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        {
          !isLoading &&
          <>
            <PokemonList pokemons={pokemonsFullList} />
            <Pagination
              handlePageChange={handlePageChange}
              page={page}
            />
          </>
        }
      </Layout>
    </div>
  )
}

export default Home

export const getStaticProps = async () => {
  const res = await fetch(`${baseURL}/?limit=16`)
  const response = await res.json()

  return {
    props: {
      response,
    },
  }
}




