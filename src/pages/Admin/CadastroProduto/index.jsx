import './index.scss';
import CabecalhoAdm from '../../../components/Admin/AdmCabecalho';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState} from 'react';
import axios from 'axios'
import { toast } from 'react-toastify';
import storage from 'local-storage'
import { alterar, buscarIdDetalhe, buscarIdImagens, buscarIdProduto } from '../../../api/produtoApi';

function CadastroProduto () {
    const [idProduto, setIdProduto] = useState(useParams())
    const [idDetalhe, setIdDetalhe] = useState(0)
    const [fotos, setFotos] = useState([]);
    const [urlImagem, setUrlImagem] = useState('');

    const [nome, setNome] = useState("");
    const [peso, setPeso] = useState("");
    const [marca, setMarca] = useState("");
    const [estoque, setEstoque] = useState("");
    const [precoVenda, setPrecoVenda] = useState(0);
    const [dimensoes, setDimensoes] = useState("");
    const [descricao, setDescricao] = useState("");
    const [precoPromocao, setPrecoPromocao] = useState(0);
    const [alergia, setAlergia] = useState("");

    const [assinatura, setAssinatura] = useState(false);

    const [categoria, setCategoria] = useState("");
    const [intensidade, setIntensidade] = useState("");
    const [acidez, setAcidez] = useState("");
    const [docura, setDocura] = useState("");
    const [torra, setTorra] = useState("");


    function adicionarImagem () {
        const img = new Image();
        img.src = urlImagem;

        img.onload = () => {
            setFotos([...fotos, urlImagem]);
            setUrlImagem('');
        }
        img.onerror = () => {
            toast.error('URL Inválida!')
        }
    }

    function removerImagem (indice) {
        const novasFotos = fotos.filter((imagem, i) => i !== indice);
        setFotos(novasFotos);
    }


    async function cadastrarProduto() {
        try {
            if(idProduto){
                if (fotos.length === 0) {
                    toast.error('Insira ao menos uma imagem!')
                } else {
                    const idAdm = storage('adm-logado').id
                    const alteracoes = {
                        idAdm: idAdm,
                        intensidade: intensidade,
                        docura: docura,
                        acidez: acidez,
                        torra: torra,
                        descricao: descricao,
                        marca: marca,
                        peso: peso,
                        alergia: alergia,
                        dimensoes: dimensoes,
                        idCategoria: categoria,
                        nome: nome,
                        preco: precoVenda,
                        promocional: precoPromocao,
                        disponivelAssinatura: assinatura,
                        estoque: estoque
                    };
                    await alterar(alteracoes, idDetalhe, idProduto)
            }}
            else{
                if (fotos.length === 0) {
                    toast.error('Insira ao menos uma imagem!')
                } else {
                    const idAdm = storage('adm-logado').id
                    const produto = {
                        idAdm: idAdm,
                        intensidade: intensidade,
                        docura: docura,
                        acidez: acidez,
                        torra: torra,
                        descricao: descricao,
                        marca: marca,
                        peso: peso,
                        alergia: alergia,
                        dimensoes: dimensoes,
                        idCategoria: categoria,
                        nome: nome,
                        preco: precoVenda,
                        promocional: precoPromocao,
                        disponivelAssinatura: assinatura,
                        estoque: estoque
                    };
        
                    let urlProduto = "http://localhost:5000/produto";
                    let respostaProduto = await axios.post(urlProduto, produto);
        
                    cadastrarImagens(respostaProduto.data.idProduto)
                    resetarCampos();
                    toast.success('Produto cadastrado!')
                }
            }
        } 
        catch (error) {
            toast.error( error.response.data.erro)
        }
    }

    
    async function cadastrarImagens (idProduto) {
        try {
            for (let item of fotos) {
                let url = "http://localhost:5000/imagemproduto";
                const imagem = {
                    idProduto: idProduto,
                    caminho: item
                }
                await axios.post(url, imagem)
            }

        } catch (error) {
            toast.error( error.response.data.erro)
        }
    }

    async function alterarInputs(){
        try{
            const produto = await buscarIdProduto(idProduto.id)
            setIdDetalhe(produto.id_detalhe)
            const detalhes = await buscarIdDetalhe(produto.id_detalhe)
            const imagens = await buscarIdImagens(idProduto.id)
            let novasImagens = []
            for(let cont = 0; cont < imagens.length; cont++){
                novasImagens[cont] = imagens[cont].caminho
            }
            setFotos(novasImagens)
            setNome(produto.produto);
            setPeso(detalhes.peso);
            setMarca(detalhes.marca);
            setEstoque(produto.estoque);
            setPrecoVenda(produto.preco);
            setDimensoes(detalhes.dimensoes);
            setDescricao(detalhes.produto);
            setPrecoPromocao(produto.promocao);
            setAlergia(detalhes.alergia);
            setAssinatura(produto.assinatura);
            setCategoria(produto.id_categoria);
            setIntensidade(detalhes.intensidade);
            setAcidez(detalhes.acidez);
            setDocura(detalhes.docura);
            setTorra(detalhes.torra);
        }
        catch(err){
            toast.error(err.response.data.erro)
        }
    }

    function resetarCampos () {
        setFotos([]);
        setNome("");
        setPeso("");
        setMarca("");
        setEstoque("");
        setPrecoVenda(0);
        setDimensoes("");
        setDescricao("");
        setPrecoPromocao(0);
        setAlergia("");
        setAssinatura(false);
        setCategoria(0);
        setIntensidade("");
        setAcidez("");
        setDocura("");
        setTorra("");
    }

    useEffect(() => {
        if(typeof idProduto.id === 'string'){
            alterarInputs()
        }
        // eslint-disable-next-line
    }, [])

    return ( 
        <main className='cadastro-produto'>
            <CabecalhoAdm />
            <nav style={{padding: '20px'}}>
                <Link to={'/adm/inicio'} style={{ decoration: 'dashed', color: 0}}> Tela Inicial </Link>
                 &gt;
                <p>Adicionar um Produto </p>
            </nav>
            <hr />

            

            <div className='conteudo'><h1>Cadastrar um novo produto</h1>
                <div className='formulario'>
                    <div className='selecao-imagem'>
                        <article className='insercao-imagem'>
                            <p>Insira a URL da imagem</p>
                            <div>
                                <textarea type="text" value={urlImagem} style={{resize: 'none', overflow: 'hidden'}} onChange={e => setUrlImagem(e.target.value)}/>
                                <button onClick={adicionarImagem}> Adicionar </button>
                            </div>
                        </article>
                        <article className="campo-imagens">
                            {fotos.map((arquivo, indice) => (
                            <div className='imagem-upada' key={indice}>
                                <p>DELETAR</p>
                                <img src={arquivo} alt="" onClick={() => removerImagem(indice)}/>
                            </div>
                            ))
                        }
                        </article>
                    </div>
                    <hr />

                    <article className='informacoes-produto'>
                        <section className='lado-esquerdo'>
                            <form action="">
                                <label htmlFor="">Nome do produto</label>
                                <textarea type="text" name="" id="" style={{resize: 'none', overflow: 'hidden'}}  value={nome} onChange={e => setNome(e.target.value)}/>
            

                                <div>
                                    <div>
                                    <label htmlFor="">Peso</label>
                                    <textarea type="text" name="" id="peso" style={{resize: 'none', overflow: 'hidden'}} value={peso} onChange={e => setPeso(e.target.value)}/>
                                
                                    </div>
                                    
                                    <div>
                                    <label htmlFor="">Estoque</label>
                                    <textarea type="text" name="" id="estoque" style={{resize: 'none', overflow: 'hidden'}} value={estoque} onChange={e => setEstoque(e.target.value)}/>
                                    </div>
                                    
                                </div>

                                <label htmlFor="">Marca</label>
                                <textarea type="text" name="" id="" style={{resize: 'none', overflow: 'hidden'}}
                                value={marca} onChange={e => setMarca(e.target.value)}/>

                                <label htmlFor="">Preço de venda</label>
                                <textarea type="text" name="" id="" style={{resize: 'none', overflow: 'hidden'}}
                                value={precoVenda} onChange={e => setPrecoVenda(e.target.value)}/>
                                

                                <label htmlFor="">Dimensões do produto</label>
                                <textarea type="text" name="" id="" style={{resize: 'none', overflow: 'hidden'}}
                                value={dimensoes} onChange={e => setDimensoes(e.target.value)}/>
                            </form>
                            
                            <article className='produto-detalhes'>
                                <section className='categorias'>
                                    <div>
                                        <label htmlFor="">
                                            <input type="radio" name="a" value={1}  onChange={e => setCategoria(e.target.value)} checked={categoria === 1 ? true : false} />
                                            <p>Café em grão</p>
                                        </label>
                                        <label htmlFor="">
                                            <input type="radio" name="a" value={2} onChange={e => setCategoria(e.target.value)} checked={categoria === 2 ? true : false}/>
                                            <p>Café em pó</p>
                                        </label>
                                        
                                        <label htmlFor="">
                                            <input type="radio" name="a" value={3}  onChange={e => setCategoria(e.target.value)} checked={categoria === 3 ? true : false}/>
                                            <p>Cafeteira</p>
                                        </label>
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            <input type="radio" name="a" value={4}  onChange={e => setCategoria(e.target.value)} checked={categoria === 4 ? true : false}/>
                                            <p>Cápsula</p>
                                        </label>
                                        <label htmlFor="">
                                            <input type="radio" name="a" value={5}  onChange={e => setCategoria(e.target.value)} checked={categoria === 5 ? true : false}/>
                                            <p>Moedor</p>
                                        </label>
                                        <label htmlFor="">
                                            <input type="radio" name="a" value={6}  onChange={e => setCategoria(e.target.value)} checked={categoria === 6 ? true : false}/>
                                            <p>Filtro</p>
                                        </label>
                                    </div>
                                </section>
                                
                                <nav className='detalhes'>
                                    <section><img src="/assets/images/intensidade.png" alt="" /> <p> Intensidade </p>   <input type="text" name="" id="" placeholder='ex: 6' value={intensidade} onChange={e => setIntensidade(e.target.value)}/></section>
                                    <section><img src="/assets/images/docura.png" alt="" />      <p> Doçura </p>        <input type="text" name="" id="" placeholder='ex: Alta' value={docura} onChange={e => setDocura(e.target.value)}/></section>
                                    <section><img src="/assets/images/acidez.png" alt="" />      <p> Acidez </p>        <input type="text" name="" id="" placeholder='ex: Alta' value={acidez} onChange={e => setAcidez(e.target.value)}/></section>
                                    <section><img src="/assets/images/torra.png" alt="" />       <p> Torra </p>         <input type="text" name="" id="" placeholder='ex: Alta' value={torra} onChange={e => setTorra(e.target.value)}/></section>
                                </nav>
                            </article>
                        </section>

                        <section className='lado-direito'>
                            <label htmlFor="">Descrição do produto</label>
                            <textarea type="text" name='' id='descricao' style={{resize: 'none', overflow: 'hidden'}}
                            value={descricao} onChange={e => setDescricao(e.target.value)}/>

                            <label htmlFor="">Preço promocional</label>
                            <textarea type="text" name='' id='' style={{resize: 'none', overflow: 'hidden'}}
                            value={precoPromocao} onChange={e => setPrecoPromocao(e.target.value)}/>

                            <label htmlFor="">Informações sobre alergia</label>
                            <textarea type="text" name='' id='alergia' style={{resize: 'none', overflow: 'hidden'}}
                            value={alergia} onChange={e => setAlergia(e.target.value)}/>

                            <div>
                                <input type="checkbox" name="" id="assinatura" checked={assinatura} 
                                onChange={e => setAssinatura(e.target.checked)}/>
                                <label htmlFor="">Disponível para assinatura</label>
                            </div>
                            <button className='' onClick={cadastrarProduto}>{id ? 'Finalizar alteração' : 'Finalizar cadastro'}</button>
                        </section>
                    </article>
                </div>
            </div>
        </main>
    )
};

export default CadastroProduto;