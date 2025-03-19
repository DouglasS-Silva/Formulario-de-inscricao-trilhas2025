document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.querySelector("form");
    const botaoInscricao = document.getElementById("botao-inscricao");
    const checkTermos = document.querySelector(".termos-condicoes input");
    const trilhas = document.querySelectorAll('input[name="area-selecionada"]'); // Seleciona todos os radios das trilhas
    const cepInput = document.getElementById("CEP");

    cepInput.addEventListener("blur", function () {
        const cep = cepInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos

        // Verifica se o CEP tem 8 dígitos
        if (cep.length === 8) {
            buscarEndereco(cep);
        } else {
            mostrarErro(cepInput, "CEP inválido. Digite 8 dígitos.");
        }
    });
    
    function buscarEndereco(cep) {
        const url = `https://viacep.com.br/ws/${cep}/json/`;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    mostrarErro(document.getElementById("CEP"), "CEP não encontrado.");
                } else {
                    // Preenche os campos de endereço
                    document.getElementById("rua").value = data.logradouro;
                    document.getElementById("cidade").value = data.localidade;
                    document.getElementById("estado").value = data.uf;
                }
            })
            .catch(() => {
                mostrarErro(document.getElementById("CEP"), "Erro ao buscar o CEP.");
            });
    }

    Inputmask({
        mask: '999.999.999-99', // Máscara para CPF
        placeholder: '000.000.000-00' // Placeholder
    }).mask(document.getElementById('CPF'));

    Inputmask({
        mask: '(99) 9 9999-9999', // Máscara para Telefone
        placeholder: '(00) 0 0000-0000' // Placeholder
    }).mask(document.getElementById('telefone'));

    Inputmask({
        mask: '99/99/9999', // Máscara para Data de Nascimento
        placeholder: 'dd/mm/aaaa' // Placeholder
    }).mask(document.getElementById('dataDeNascimento'));

    Inputmask({
        mask: '99999-999', // Máscara para o CEP
        placeholder: '00000-000'
    }).mask(document.getElementById('CEP'));

    const inputs = document.querySelectorAll("input, select");
    inputs.forEach(input => {
        input.addEventListener("focus", function () {
            this.style.borderColor = "#E43A12";
        });
        input.addEventListener("blur", function () {
            this.style.borderColor = "#D6D3D1";
        });
    });

    botaoInscricao.addEventListener("click", function (event) {
        event.preventDefault();

        // Limpar mensagens de erro anteriores
        document.querySelectorAll(".erro").forEach(erro => erro.remove());

        // Verificar campos obrigatórios
        const nomeCompleto = document.getElementById("nomeCompleto");
        const email = document.getElementById("email");
        const telefone = document.getElementById("telefone");
        const dataDeNascimento = document.getElementById("dataDeNascimento");
        const CPF = document.getElementById("CPF");
        const sexo = document.getElementById("sexo");
        const CEP = document.getElementById("CEP");
        const numero = document.getElementById("numero");
        const documentoIdentidade = document.getElementById("documento-identidade");
        const comprovanteResidencial = document.getElementById("comprovante-residencial");

        let valido = true;

        if (!nomeCompleto.value) {
            mostrarErro(nomeCompleto, "Por favor, insira seu nome completo.");
            valido = false;
        }

        if (!email.value) {
            mostrarErro(email, "Por favor, insira seu e-mail.");
            valido = false;
        } else if (!validarEmail(email.value)) {
            mostrarErro(email, "Por favor, insira um e-mail válido.");
            valido = false;
        }

        if (!telefone.value) {
            mostrarErro(telefone, "Por favor, insira seu telefone.");
            valido = false;
        }

        if (!dataDeNascimento.value) {
            mostrarErro(dataDeNascimento, "Por favor, preencha a data de nascimento.");
            valido = false;
        
        }

        if (!CPF.value) {
            mostrarErro(CPF, "Por favor, preencha o CPF.");
            valido = false;
        }

        if (!sexo.value) {
            mostrarErro(sexo, "Por favor, escolha o Sexo.");
            valido = false;
        }

        if (!CEP.value) {
            mostrarErro(CEP, "Por favor, preencha o CEP.");
            valido = false;
        }

        if (!numero.value) {
            mostrarErro(numero, "Por favor, insira o número da residência.");
            valido = false;
        }

        if (!documentoIdentidade.files || documentoIdentidade.files.length === 0) {
            mostrarErro(documentoIdentidade, "Por favor, selecione o documento de identidade.");
            valido = false;
        }

        if (!comprovanteResidencial.files || comprovanteResidencial.files.length === 0) {
            mostrarErro(comprovanteResidencial, "Por favor, selecione o comprovante residencial.");
            valido = false;
        }

        // Verificar se uma trilha foi selecionada
        let trilhaSelecionada = false;
        trilhas.forEach(trilha => {
            if (trilha.checked) {
                trilhaSelecionada = true;
            }
        });

        if (!trilhaSelecionada) {
            mostrarErro(document.querySelector(".trilhas-aprendizagem"), "Por favor, selecione uma trilha.");
            valido = false;
        }

        // Verificar termos e condições
        if (!checkTermos.checked) {
            mostrarErro(checkTermos, "Você precisa aceitar os termos e condições.");
            valido = false;
        }

        // Se tudo estiver válido, exibir o loading e o pop-up
        if (valido) {
            const loading = document.getElementById("loading");
            loading.style.display = "block";

            // Simular um processamento de 2 segundos
            setTimeout(function () {
                loading.style.display = "none";

                // Exibir o pop-up de confirmação
                const popup = document.createElement("div");
                popup.innerHTML = `
                    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); text-align: center; z-index: 1000;">
                        <h2 style="color: #E43A12;">Inscrição realizada!</h2>
                        <p>Você se inscreveu com sucesso na trilha escolhida.</p>
                        <p>Confirmação enviada para seu e-mail!</p>
                        <button id="fecharPopup" style="margin-top: 10px; padding: 8px 12px; background: #E43A12; color: white; border: none; border-radius: 5px; cursor: pointer;">Fechar</button>
                    </div>
                `;
                document.body.appendChild(popup);

                // Fechar pop-up
                document.getElementById("fecharPopup").addEventListener("click", function () {
                    popup.remove();
                });
            }, 2000); // 2 segundos de simulação
        }
    });

   // Função para exibir mensagens de erro
    function mostrarErro(campo, mensagem) {
        let erroExistente = campo.parentNode.querySelector(".erro");
        if (!erroExistente) {
            const erro = document.createElement("p");
            erro.textContent = mensagem;
            erro.style.color = "red";
            erro.style.fontSize = "14px";
            erro.classList.add("erro");
            campo.parentNode.appendChild(erro);
        } else {
            erroExistente.textContent = mensagem;
        }
    }

    // Função para remover erro quando o usuário começa a digitar/preencher o campo
    function removerErro(campo) {
        let erro = campo.parentNode.querySelector(".erro");
        if (erro) {
            erro.remove();
        }
    }

    // Lista de campos a serem monitorados
    const camposTexto = ["nomeCompleto", "email", "telefone", "dataDeNascimento", "CPF", "CEP", "numero"];
    const camposSelect = ["sexo"];
    const camposArquivo = ["documento-identidade", "comprovante-residencial"];

    // Adicionar evento 'input' nos campos de texto
    camposTexto.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener("input", () => removerErro(campo));
        }
    });

    // Adicionar evento 'change' nos campos do tipo select
    camposSelect.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener("change", () => removerErro(campo));
        }
    });

    // Adicionar evento 'change' nos inputs de arquivo
    camposArquivo.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener("change", () => removerErro(campo));
        }
    });

    // Adicionar evento 'change' no checkbox de termos
    checkTermos.addEventListener("change", function () {
        removerErro(checkTermos);
    });

    // Adicionar evento 'change' para os radio buttons das trilhas
    trilhas.forEach(trilha => {
        trilha.addEventListener("change", function () {
            removerErro(document.querySelector(".trilhas-aprendizagem"));
        });
    });

    // Função para validar e-mail
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});

