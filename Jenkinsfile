pipeline {
    agent any 

    environment {
        IMAGE = 'nest-sample-project'
        TAG = 'latest'
        CONTAINER_NAME = 'nest-sample-project' 
    }

    stages {
        stage('Latest Code Checkout') {
            steps {
                git(
                    url: "https://github.com/sumanthsarmagarlapati/nest-project-template.git",
                    branch: "staging",
                    credentialsId: "GITHUB-CRED"
                )
            }
        }

        stage('Remove Docker Image') {
            steps {
                script {
                    bat "docker rmi -f ${IMAGE}:${TAG} || echo Image not found"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    bat "docker build -t ${IMAGE}:${TAG} ."
                }
            }
        }

        stage('Remove Container') {
            steps {
                script {
                    bat "docker rm -f ${CONTAINER_NAME} || echo Container not found"
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    bat "docker run --env-file .env-prod -d -p 2001:2001 --name ${CONTAINER_NAME} ${IMAGE}:${TAG}"
                }
            }
        }
    }

    post {
        always {
            echo "Jenkins Job Completed"
        }
        success {
            echo "Jenkins Job Success"
        }
        failure {
            echo "Jenkins Job Failed"
        }
    }
}
