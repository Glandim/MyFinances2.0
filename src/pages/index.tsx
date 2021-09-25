import Head from 'next/head'
import React, { useState, useReducer } from 'react'

const openModal = () => {
  document
    .querySelector('.modal-overlay')
    .classList
    .add('active')
}

const closeModal = () => {
  document
    .querySelector('.modal-overlay')
    .classList
    .remove('active')
}

const formatDate = (data) => {
  const splittedDate = data.split("-")

  return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
}

export default function Home() {
  const [descr, setDescr] = useState('')
  const [valor, setValor] = useState('')
  const [data, setData] = useState('')
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [allTransactions, setAllTransactions] = useState([])

  React.useEffect(() => {
    init()
  }, [])

  React.useEffect(() => {
    let _income: any = 0;
    
    allTransactions.forEach(element => {
      let _valor = parseFloat(element.valor)
      if (_valor > 0) {
        _income += _valor
      }
    });

    setIncome(_income)
  }, [allTransactions])

  React.useEffect(() => {
    let _expense: any = 0;
    
    allTransactions.forEach(element => {
      let _valor = parseFloat(element.valor)
      if (_valor < 0) {
        _expense += _valor
      }
    });

    setExpense(_expense)
  }, [allTransactions])

  const init = (param?) => {
    if (param != undefined) {
      localStorage.setItem("MyFinances:transaction", JSON.stringify(param))
    } 
    
    setAllTransactions(JSON.parse(localStorage.getItem("MyFinances:transaction")) || [])
  }

  const removeTransaction = (index) => {
    const temp = [...allTransactions];
    temp.splice(index, 1)

    init(temp)
  }

  const add = async (transaction) => {
    allTransactions.push(transaction)

    localStorage.setItem("MyFinances:transaction", JSON.stringify(allTransactions))

    closeModal()
    clearFields()

    init()
  }

  const formatCurrency = (value) => {
    value = Number(value)
    
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })

    return value
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (descr.trim() === '' ||
      valor.trim() === '' ||
      data.trim() === '') {
      alert("Por favor, preencha todos os campos")
      return
    }

    const transaction = await { descr, valor, data }
    add(transaction)
  }

  const clearFields = () => {
    setDescr('')
    setValor('')
    setData('')
  }

  return (
    <div>
      <Head>
        <title>My Finances 2.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-screen">
        <header className="bg-green-700">
          <h1 className="text-white font-thin text-center pt-8 pb-40 text-3xl">My Finances 2.0</h1>
        </header>

        <main className="container mx-auto max-w-3xl w-11/12">
          <div className="grid md:grid-cols-3 gap-4 -mt-14 mb-4">
            <div className="flex-1 text-center bg-white px-8 py-6 rounded">
              <h3 className="flex items-center justify-between">
                <span className="text-base font-normal text-gray-500">Entradas</span>
                <img src="/income.svg" alt="" />
              </h3>

              <p className="text-3xl pt-4 text-gray-500 text-left">{formatCurrency(income)}</p>
            </div>

            <div className="flex-1 text-center bg-white px-8 py-6 rounded">
              <h3 className="flex items-center justify-between">
                <span className="text-base font-normal text-gray-500">Saidas</span>
                <img src="/expense.svg" alt="" />
              </h3>

              <p className="text-3xl pt-4 text-gray-500 text-left">{formatCurrency(expense)}</p>
            </div>

            <div className="flex-1 text-center bg-green-400 px-8 py-6 rounded">
              <h3 className="flex items-center justify-between">
                <span className="text-base text-white font-normal">Total</span>
                <img src="/total.svg" alt="" />
              </h3>

              <p className="text-3xl pt-4 text-white text-left">{formatCurrency(income + expense)}</p>
            </div>
          </div>

          <div className="block w-full overflow-x-auto">
            <a href="#" onClick={() => openModal()} className="text-green-400 hover:text-green-600">+ Nova transação</a>

            <table className="w-full mt-2 border-separate" id="data-table">
              <thead>
                <tr>
                  <th className="bg-white text-left px-8 py-4 font-normal rounded-l">Descrição</th>
                  <th className="bg-white text-left px-8 py-4 font-normal">Valor</th>
                  <th className="bg-white text-left px-8 py-4 font-normal">Data</th>
                  <th className="bg-white text-left px-8 py-4 font-normal rounded-r"></th>
                </tr>
              </thead>

              <tbody >
                {allTransactions.map((element, index) => {
                  return (
                    <tr className="opacity-70 hover:opacity-100" key={index}>
                      <td className="bg-white px-8 py-4 rounded-l">{element.descr}</td>
                      <td className={element.valor > 0 ? 'bg-white px-8 py-4 text-green-400' : 'bg-white px-8 py-4 text-red-400'}>{formatCurrency((element.valor))}</td>
                      <td className="bg-white px-8 py-4">{formatDate(element.data)}</td>
                      <td className="bg-white px-8 py-4 rounded-r "><img className="cursor-pointer" onClick={() => removeTransaction(index)} src="/minus.svg" alt="" /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </main>

        <div className="w-full h-full bg-black bg-opacity-70 fixed top-0 flex items-center justify-center z-999 modal-overlay">
          <div className="w-11/12 max-w-lg bg-gray-100 p-9 relative z-1 rounded">
            <div className="max-w-lg">
              <h2 className="mt-0 mb-3 font-normal text-2xl text-gray-500">Nova transação</h2>

              <form onSubmit={handleSubmit}>
                <div className="mt-3">
                  <input
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Descrição"
                    className="w-full border-none rounded p-3"
                    value={descr}
                    onChange={e => setDescr(e.target.value)}
                  />
                </div>

                <div className="mt-3">
                  <input
                    type="number"
                    id="amount"
                    step="0.01"
                    name="amount"
                    placeholder="0,00"
                    className="w-full border-none rounded p-3"
                    value={valor}
                    onChange={e => setValor(e.target.value)}
                  />
                </div>
                <small className="opacity-40">Use o sinal - (negativo) para despesas e , (vírgula) para casas decimais</small>

                <div className="mt-3">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="w-full border-none rounded p-3"
                    value={data}
                    onChange={e => setData(e.target.value)}
                  />
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <a href="#" onClick={() => (closeModal(), clearFields())}
                    className="w-1/2 mr-2 text-center border-2 rounded h-11 p-2 border-red-500 text-red-500 opacity-60 hover:opacity-100">Cancelar</a>
                  <button className="w-1/2 ml-2 bg-green-400 h-11 rounded text-white opacity-60 hover:opacity-100" type="submit">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center pt-16 pb-8 text-gray-500"><p>My Finances 2.0</p></footer>
    </div>
  )
}
