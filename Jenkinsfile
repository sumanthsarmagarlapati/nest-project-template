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
                    sh "docker rmi -f ${IMAGE}:${TAG} || true"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${IMAGE}:${TAG} ."
                }
            }
        }

        stage('Remove Container') {
            steps {
                script {
                    sh "docker rm -f ${CONTAINER_NAME} || true"
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    sh "docker run -d -p 3000:3000 --name ${CONTAINER_NAME} ${IMAGE}:${TAG}"
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
