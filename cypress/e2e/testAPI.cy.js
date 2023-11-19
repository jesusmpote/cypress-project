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
    it.only('Consultar la mascota por ID', () => {
        
        cy.request('https://petstore.swagger.io/v2/pet/' + nuevaMascotaId) 
        .then((response) => {
          expect(response.status).to.equal(200); 
          expect(response.body.id).to.equal(nuevaMascotaId); 
        });
      
    
    })
    it.only('Modificar la mascota por nombre y status', () => {
        cy.request({
            method: 'PUT', 
            url: 'https://petstore.swagger.io/v2/pet',
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              
              name: 'Morena',
              status: 'sold',
              
            },
          }).then((response) => {
            expect(response.status).to.equal(200); 
            newStatus = response.body.status
            cy.log(response.body.name, newStatus)
            
          });
        });

        it.only('Debería consultar la mascota por Status', () => {
            cy.request('https://petstore.swagger.io/v2/pet/findByStatus?status=' + newStatus) 
            .then((response) => {
                response.body.forEach((element) => {
                    expect(element).to.have.property('status');
                    expect(element.status).to.equal('sold');
                    cy.log(element.status)
                });
            });
          
        
        })
})