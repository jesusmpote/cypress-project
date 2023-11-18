const celulares =['Samsung galaxy s6','Nokia lumia 1520']
const precio = ['$360','$820']
//const Home = new main
describe('Entrando a la home', () => {
    it('',()=>{
        cy.visit('https://www.demoblaze.com/')
        cy.url('https://www.demoblaze.com/').should('eq','https://www.demoblaze.com/');
        cy.contains('PRODUCT STORE').should('exist')
        //seleciona primer celular
        cy.get('#tbodyid>div').eq(0).contains('Samsung galaxy s6').click()
        //GUARDA MODELO primer celular
        cy.get('h2').should('have.text','Samsung galaxy s6').then(($elemento)=>{
            const modelo1 = $elemento.text()
            cy.log(modelo1)
            cy.wrap(modelo1).as('model1')
        })
            cy.get('.col-sm-12 > .btn').click()
            //GUARDA PRECIO PRIMER CELULAR
            cy.get('h3').should('contain','$360').and('exist').then(($elemento)=>{
                const precio1 = $elemento.text()
                cy.log(precio1)
                cy.wrap(precio1).as('price1')
            })
            //SELECCIONA SEGUNDO CELULAR
            cy.visit('https://www.demoblaze.com/')
            cy.get('#tbodyid>div').eq(1).contains('Nokia lumia 1520').click()

            //GUARDA MODELO SEGUNDO CELULAR
            cy.get('h2').should('have.text','Nokia lumia 1520').then(($elemento)=>{
            const modelo2 = $elemento.text()
            cy.log(modelo2)
            cy.wrap(modelo2).as('model2')
        })
            //GUARDA PRECIO SEGUNDO CELULAR
            cy.get('h3').should('contain','$820').and('exist').then(($elemento)=>{
                const precio2 = $elemento.text()
                cy.log(precio2)
                cy.wrap(precio2).as('price2')
            })
            //HACE CLICK EN EL BOTON DE ADD CARD
            cy.get('.col-sm-12 > .btn').click()

            //ENTRA AL CARRITO
            cy.get('.nav-link').eq(3).click()
            cy.log('entro al carrito')

            //VALIDA EXISTA PRIMER CELULAR
            cy.get('@model1').then((modelo1)=>{
                cy.get('#tbodyid > :nth-child(1) > :nth-child(2)').then(($elemento)=>{  
                    cy.wait(2000)
                    const verificaCel = $elemento.text()
                    expect(verificaCel).contains(modelo1)
                    })
            })
                //VALIDA PRECIO DEL PRIMER CELULAR
                    cy.get('#tbodyid > :nth-child(1) > :nth-child(3)').then(($elemento)=>{  
                        cy.wait(2000)
                        const verificaPrecio = $elemento.text()
                        expect(verificaPrecio).to.include(360)
                    })
                cy.get('@model2').then((modelo2)=>{
                    cy.get('#tbodyid > :nth-child(2) > :nth-child(2)').then(($elemento)=>{  
                    cy.wait(2000)
                    const verificaCel = $elemento.text()
                    expect(verificaCel).contains(modelo2)
                    })
                })
                cy.get('#tbodyid > :nth-child(2) > :nth-child(3)').then(($elemento)=>{  
                    cy.wait(2000)
                    const verificaPrecio = $elemento.text()
                    expect(verificaPrecio).to.include(820)
                })
                //procesa la orden
                cy.contains('button','Place Order').click()
                //comploeta form
                cy.get('#name').click().type('Juan')
                cy.get('#country').click().type('Argentina')
                cy.get('#city').click().type('Cordoba')
                cy.get('#card').click().type('456912345432')
                cy.get('#month').click().type('Enero')
                cy.get('#year').click().type('2023')
                cy.contains('button','Purchase').click()
                cy.get('.sweet-alert').should('be.visible')
                cy.get('.sweet-alert > h2').should('have.text','Thank you for your purchase!')
                cy.get('.confirm').click()
    
    })
})


describe('Agregar mascota a la tienda', () => {
    let nuevaMascotaId
    let newStatus;
    it.only( 'agregar una mascota a la tienda', () => {
      cy.request({
        method: 'POST',
        url: 'https://petstore.swagger.io/v2/pet', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
            "id": 2,
            "category": {
              "id": 0,
              "name": "string"
            },
            "name": "canela",
            "photoUrls": [
              "string"
            ],
            "tags": [
              {
                "id": 0,
                "name": "string"
              }
            ],
            "status": "available"
          },
      }).then((response) => {
        expect(response.status).to.equal(200);
        nuevaMascotaId = response.body.id
        cy.log(nuevaMascotaId)
      });
    });
    it.only('Debería consultar la mascota por ID', () => {
        //expect(nuevaMascotaId).to.not.be.undefined
        cy.request('https://petstore.swagger.io/v2/pet/' + nuevaMascotaId) // Reemplaza con la URL correcta y el ID de la mascota
        .then((response) => {
          expect(response.status).to.equal(200); // Verifica que la solicitud haya tenido éxito
          expect(response.body.id).to.equal(nuevaMascotaId); // Verifica que el ID de la mascota sea el correcto
        });
      
    
    })
    it.only('Debería modificar la mascota por nombre y status', () => {
        cy.request({
            method: 'PUT', // o 'PUT' dependiendo de tu API
            url: 'https://petstore.swagger.io/v2/pet', // Reemplaza con la URL correcta y el ID de la mascota
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              // Nuevos datos para actualizar la mascota
              name: 'Morena',
              status: 'sold',
              // Otros campos que necesites actualizar
              
            },
          }).then((response) => {
            expect(response.status).to.equal(200); // Verifica que la solicitud haya tenido éxito
            newStatus = response.body.status
            cy.log(response.body.name, newStatus)
            // Puedes agregar más aserciones si la API devuelve algún mensaje específico tras la actualización
          });
        });

        it.only('Debería consultar la mascota por Status', () => {
            //expect(nuevaMascotaId).to.not.be.undefined
            cy.request('https://petstore.swagger.io/v2/pet/findByStatus?status=' + newStatus) // Reemplaza con la URL correcta y el ID de la mascota
            .then((response) => {
                response.body.forEach((element) => {
                    expect(element).to.have.property('status');
                    expect(element.status).to.equal('sold');
                    cy.log(element.status)
                });
                //expect(pet.status).to.equal('sold');
              //expect(response.status).to.equal(200); // Verifica que la solicitud haya tenido éxito
              //expect(response.body.tags.status).to.equal(newStatus); // Verifica que el ID de la mascota sea el correcto
            });
          
        
        })
})
  



